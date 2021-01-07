import { Controller, Get, Param } from '@nestjs/common';
import { IImage } from '../images/interfaces/IImage';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) { }
  
  @Get(":searchTerm")
  async getAllImages(@Param('searchTerm') searchTerm: string): Promise<IImage[]> {
    return await this.searchService.getImagesBySearchParams(JSON.parse(searchTerm));
  }
}
