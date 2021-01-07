import { IImage } from "src/images/interfaces/IImage";
import { ISearchTerm } from "./ISearchTerm";

export interface ISearchIntrface {
  getImagesBySearchParams(params: ISearchTerm): Promise<IImage[]>;
}