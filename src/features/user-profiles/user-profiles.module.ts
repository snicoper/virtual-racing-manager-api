import { Module } from '@nestjs/common';
import { SecurityModule } from '../../core/security/security.module';
import { UserProfileRepository } from './core/repositories/user-profile.repository';
import { GetBySlugService } from './get-by-slug/get-by-slug.service';
import { SlugAvailabilityService } from './slug-availability/slug-availability.service';
import { UpdateService } from './update/update.service';
import { UserProfilesController } from './user-profiles.controller';
import { MeService } from './me/me.service';

@Module({
  controllers: [UserProfilesController],
  providers: [
    UserProfileRepository,
    GetBySlugService,
    UpdateService,
    SlugAvailabilityService,
    MeService,
  ],
  imports: [SecurityModule],
})
export class UserProfilesModule {}
