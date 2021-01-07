import { IImage } from "src/images/interfaces/IImage";
import { IPaginatedPage } from "./IPaginatedPage";

export interface IImagesService {
  getAllImages(): Promise<void>;
  getShortInfoImagesByPage(authorization: string, page: number): Promise<IPaginatedPage>;
  getImageById(authorization: string, id: string): Promise<IPaginatedPage>;
}