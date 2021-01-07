import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { IImage } from '../images/interfaces/IImage';
import { ISearchTerm } from './interfaces/ISearchTerm';
import { Cache } from "cache-manager";

@Injectable()
export class SearchService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  
  public async getImagesBySearchParams(params: ISearchTerm): Promise<IImage[]> {
    const { id, author, camera, tags } = params;
    const isFilterPresented = id || author || camera || tags;
    let images = await this.cacheManager.get('images') as IImage[];
    const tagsArray = tags ? tags.split(' ') : [];

    if (!isFilterPresented) return images;

    if (id) images = images.filter((image) => image.id === id);
    if (author) images = images.filter((image) => image.author === author);
    if (camera) images = images.filter((image) => image.camera === camera);
    if (tagsArray.length > 0) images = images.filter((image) => {
      for (const tag of tagsArray) {
        if (image.tags.includes(tag)) return true;   
      }
      return false;
    });

    return images;
  }
}
