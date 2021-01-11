import { IImage } from 'src/images/interfaces/IImage';

export interface ISearchInterface {
  getImagesBySearchParams(searchTerm: string): Promise<IImage[]>;
}
