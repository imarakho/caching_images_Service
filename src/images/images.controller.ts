import { Logger, Param, Query } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';
import { IPaginatedPage } from './interfaces/IPaginatedPage';

@Controller('images')
export class ImagesController {
  private readonly logger = new Logger();

  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getImagesByPage(@Query('page') page?: number): Promise<IPaginatedPage> {
    const isPageExisted = page && page > 0;

    isPageExisted
      ? this.logger.log(`GET images by specific page ${page}`)
      : this.logger.log(`GET first page of images`);
    return await this.imagesService.getShortInfoImagesByPage(page);
  }

  @Get(':id')
  async getImageById(@Param('id') id: string): Promise<IPaginatedPage> {
    this.logger.log('GET images by specific id!');
    return await this.imagesService.getImageById(id);
  }
}
