import { Param, Query, Req } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Request } from 'express';
import { IPaginatedPage } from './interfaces/IPaginatedPage';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
  ) { }

  @Get()
  async getImagesByPage(@Req() request: Request, @Query() page?: number): Promise<IPaginatedPage> {
    const { authorization } = request.headers;
    return await this.imagesService.getShortInfoImagesByPage(authorization, page);
  }

  @Get(':id')
  async getImageById(@Req() request: Request, @Param('id') id: string): Promise<IPaginatedPage> {;
    const { authorization } = request.headers;
    return await this.imagesService.getImageById(authorization, id);
  }
}
