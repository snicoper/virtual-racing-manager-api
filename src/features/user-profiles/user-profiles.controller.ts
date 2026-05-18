import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { GetBySlugRequest } from './get-by-slug/get-by-slug.request';
import { GetBySlugResponse } from './get-by-slug/get-by-slug.response';
import { GetBySlugService } from './get-by-slug/get-by-slug.service';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly getBySlugService: GetBySlugService) {}

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  getBySlug(@Param() request: GetBySlugRequest): Promise<GetBySlugResponse> {
    return this.getBySlugService.handle(request);
  }

  @Put(':slug')
  updateBySlug(): string {
    return 'This action updates a #id user-profile';
  }
}
