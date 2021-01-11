import { IPaginatedPage } from './IPaginatedPage';

export interface IImagesService {
  getAllImages(): Promise<void>;
  getShortInfoImagesByPage(page: number): Promise<IPaginatedPage>;
  getImageById(id: string): Promise<IPaginatedPage>;
}
