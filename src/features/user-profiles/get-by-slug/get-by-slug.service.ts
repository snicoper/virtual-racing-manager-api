import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileRepository } from '../core/repositories/user-profile.repository';
import { GetBySlugRequest } from './get-by-slug.request';
import { GetBySlugResponse } from './get-by-slug.response';

@Injectable()
export class GetBySlugService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(request: GetBySlugRequest): Promise<GetBySlugResponse> {
    const userProfile = await this.userProfileRepository.getBySlug(
      request.slug,
    );

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    const result: GetBySlugResponse = {
      id: userProfile.id,
      userId: userProfile.userId,
      slug: userProfile.slug,
      nickname: userProfile.nickname,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      country: userProfile.country,
      bio: userProfile.bio,
      avatarUrl: userProfile.avatarUrl,
    };

    return result;
  }
}
