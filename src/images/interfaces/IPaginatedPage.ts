import { IShortInfoImage } from './IShortInfoImage';

export interface IPaginatedPage {
  pictures: IShortInfoImage[];
  page: number;
  pageCount: number;
  hasMore: boolean;
}
