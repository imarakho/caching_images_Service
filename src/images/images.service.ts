import {
  CACHE_MANAGER,
  HttpException,
  HttpService,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { IPaginatedPage } from './interfaces/IPaginatedPage';
import { IShortInfoImage } from './interfaces/IShortInfoImage';
import { Cache } from 'cache-manager';
import { IImagesService } from './interfaces/IImages.service';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService implements IImagesService {
  private apiUrl: string;
  private authToken: string;
  private apiKey: string;
  private cacheExpirationTime: number;
  private readonly logger = new Logger();

  constructor(
    private readonly http: HttpService,
    @Inject('AuthService')
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = configService.get('API_URL');
    this.apiKey = configService.get('API_KEY');
    this.cacheExpirationTime = Number(
      configService.get('CACHE_EXPIRATION_TIME_IN_MINITES'),
    );
    this.getAllImages();
  }

  @Interval(1000 * 60 * 15)
  public async getAllImages(): Promise<void> {
    try {
      await this.getToken();
      let page = 1;
      let allImages = [];
      let [hasMore, images] = await this.getImagesByPage(page);

      allImages.concat(images);
      page++;
      while (hasMore) {
        [hasMore, images] = await this.getImagesByPage(page);
        allImages = allImages.concat(images);
        page++;
      }
      await this.cacheManager.set('images', allImages, {
        ttl: this.cacheExpirationTime * 60 * 1000,
      });

      this.logger.log('New data cached from images API!');
    } catch (error) {
      this.logger.error('Unable fetch images from API!');
      if (error.response) {
        const { status, statusText } = error.response;
        this.logger.error(`Error ImagesService: ${status}:${statusText}`);
        throw new HttpException(
          {
            status: status,
            error: statusText,
          },
          status,
        );
      } else throw error;
    }
  }

  public async getShortInfoImagesByPage(page: number): Promise<IPaginatedPage> {
    try {
      const response = await this.http
        .get(`${this.apiUrl}/images`, {
          headers: {
            authorization: this.authToken,
          },
          params: { page },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      const { status, statusText } = error.response;

      this.logger.error(`Error ImagesService: ${status}:${statusText}`);
      throw new HttpException(
        {
          status: status,
          error: statusText,
        },
        status,
      );
    }
  }

  public async getImageById(id: string): Promise<IPaginatedPage> {
    try {
      const response = await this.http
        .get(`${this.apiUrl}/images/${id}`, {
          headers: {
            authorization: this.authToken,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      const { status, statusText } = error.response;

      this.logger.error(`Error: ${status}:${statusText}`);
      throw new HttpException(
        {
          status: status,
          error: statusText,
        },
        status,
      );
    }
  }

  private async getToken(): Promise<void> {
    this.authToken = await this.authService.getToken(this.apiKey);
  }

  private async getImagesByPage(
    page: number,
  ): Promise<[boolean, IPaginatedPage[]]> {
    const paginatedShortInfoImages = await this.getShortInfoImagesByPage(page);
    const { pictures: shortInfoImages } = paginatedShortInfoImages;
    const { hasMore } = paginatedShortInfoImages;
    const images = await this.getImagesByShortInfo(shortInfoImages);

    return [hasMore, images];
  }

  private async getImagesByShortInfo(
    shortInfoImages: IShortInfoImage[],
  ): Promise<IPaginatedPage[]> {
    const imagePromises = shortInfoImages.map((picture) => {
      const { id } = picture;

      return this.getImageById(id);
    });

    return await Promise.all(imagePromises);
  }
}
