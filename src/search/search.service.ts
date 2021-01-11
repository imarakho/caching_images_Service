import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IImage } from '../images/interfaces/IImage';
import { Cache } from 'cache-manager';
import { ISearchInterface } from './interfaces/ISearch.interface';

@Injectable()
export class SearchService implements ISearchInterface {
  private readonly logger = new Logger();

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async getImagesBySearchParams(searchTerm: string): Promise<IImage[]> {
    try {
      this.logger.log(`GET images from cache by search term: ${searchTerm}`);
      const images = (await this.cacheManager.get('images')) as IImage[];
      const searchTermToLowerCase = searchTerm.toLowerCase();
      const filteredImages = images.filter((image) => {
        const { author, camera, tags } = image;

        return (
          (author && author.toLowerCase().includes(searchTermToLowerCase)) ||
          (camera && camera.toLowerCase().includes(searchTermToLowerCase)) ||
          (tags && tags.toLowerCase().includes(searchTermToLowerCase))
        );
      });
      this.logger.log(`Images fetched from cache!`);

      return filteredImages;
    } catch (error) {
      this.logger.error(
        `Error SearchSevice: ${error}, 500:Internal Server Error`,
      );

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Internal Sever Error: Error when search images by searchTerm '${searchTerm}'.`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
