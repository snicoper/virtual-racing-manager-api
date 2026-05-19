import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from '../../core/security/contracts/jwt-payload.contract';
import { Permissions } from '../../core/security/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Permission } from '../../core/security/types/permission.enum';
import { GetBySlugRequest } from './get-by-slug/get-by-slug.request';
import { GetBySlugResponse } from './get-by-slug/get-by-slug.response';
import { GetBySlugService } from './get-by-slug/get-by-slug.service';
import { MeResponse } from './me/me.response';
import { MeService } from './me/me.service';
import { SlugAvailabilityRequest } from './slug-availability/slug-availability.request';
import { SlugAvailabilityResponse } from './slug-availability/slug-availability.response';
import { SlugAvailabilityService } from './slug-availability/slug-availability.service';
import { UpdateRequest } from './update/update.request';
import { UpdateResponse } from './update/update.response';
import { UpdateService } from './update/update.service';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(
    private readonly getBySlugService: GetBySlugService,
    private readonly updateService: UpdateService,
    private readonly slugAvailabilityService: SlugAvailabilityService,
    private readonly meService: MeService,
  ) {}

  @Get('slug-availability/:slug')
  @HttpCode(HttpStatus.OK)
  async availabilitySlug(
    @Param() request: SlugAvailabilityRequest,
  ): Promise<SlugAvailabilityResponse> {
    return this.slugAvailabilityService.handle(request.slug);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UserProfilesRead)
  @HttpCode(HttpStatus.OK)
  getMe(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<MeResponse | null> {
    return this.meService.handle(req.user.sub);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  getBySlug(@Param() request: GetBySlugRequest): Promise<GetBySlugResponse> {
    return this.getBySlugService.handle(request);
  }

  @Put()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UserProfilesUpdate)
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request & { user: JwtPayload },
    @Body() request: UpdateRequest,
  ): Promise<UpdateResponse> {
    return this.updateService.handle(request, req.user.sub);
  }
}
