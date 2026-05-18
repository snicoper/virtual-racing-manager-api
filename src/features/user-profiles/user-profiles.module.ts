import { Module } from '@nestjs/common';
import { UserProfileRepository } from './core/repositories/user-profile.repository';
import { GetBySlugService } from './get-by-slug/get-by-slug.service';
import { UserProfilesController } from './user-profiles.controller';

@Module({
  controllers: [UserProfilesController],
  providers: [UserProfileRepository, GetBySlugService],
})
export class UserProfilesModule {}
