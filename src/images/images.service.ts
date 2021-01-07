import { CACHE_MANAGER, HttpService, Inject, Injectable, } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { IPaginatedPage } from './interfaces/IPaginatedPage';
import { IShortInfoImage } from './interfaces/IShortInfoImage';
import { Cache } from "cache-manager";
import { IImagesService } from './interfaces/IImages.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ImagesService implements IImagesService {
  private apiUrl: string;
  private authToken: string;
  private apiKey: string;
  private cacheExpirationTime: number;

  constructor(
    private readonly http: HttpService,
    @Inject('AuthService')
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.apiUrl = process.env.API_URL;
    this.apiKey = process.env.API_KEY;
    this.cacheExpirationTime = Number(process.env.CACHE_EXPIRATION_TIME_IN_MINITES);
   }
  
  @Cron(CronExpression.EVERY_30_MINUTES)
  public async getAllImages(): Promise<void> {
    await this.getToken();
    let page = 1;
    let allImages = [];
    let [hasMore, images] = await this.getImagesByPage(this.authToken, page);

    allImages.concat(images);
    page++;
    while (hasMore) {
      [ hasMore, images ] = await this.getImagesByPage(this.authToken, page);
      allImages = allImages.concat(images);
      page++;
    }
    await this.cacheManager.set('images', allImages,  { ttl: this.cacheExpirationTime * 60 * 1000 });
  }

  public async getShortInfoImagesByPage(authorization: string, page: number): Promise<IPaginatedPage> {
    const result = await this.http.get(
      `${this.apiUrl}/images`,
      {
        headers: { authorization },
        params: { page },
      },
    ).toPromise();

    return result.data; 
  }

  public async getImageById(authorization: string, id: string): Promise<IPaginatedPage> {
    const result = await this.http.get(
      `${this.apiUrl}/images/${id}`,
      { headers: { authorization }},
    ).toPromise();

    return result.data; 
  }

  private async getToken(): Promise<void> {
    this.authToken = await this.authService.getToken(this.apiKey);
  }

  private async getImagesByPage(authorization: string, page: number): Promise<any> {
    const paginatedShortInfoImages = await this.getShortInfoImagesByPage(authorization, page);
    const { pictures: shortInfoImages } = paginatedShortInfoImages;
    const { hasMore } = paginatedShortInfoImages;
    const images = await this.getImagesByShortInfo(authorization, shortInfoImages);
    
    return [ hasMore, images ];
  }

  private async getImagesByShortInfo(authorization: string, shortInfoImages: IShortInfoImage[]): Promise<any> {
    const imagePromises = shortInfoImages.map(picture => {
      const { id } = picture;

      return this.getImageById(authorization, id);
    });

    return await Promise.all(imagePromises);
  }
}
