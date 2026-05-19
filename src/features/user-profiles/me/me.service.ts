import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '../core/repositories/user-profile.repository';
import { MeResponse } from './me.response';

@Injectable()
export class MeService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(userId: string): Promise<MeResponse | null> {
    const userProfile = await this.userProfileRepository.getByUserId(userId);

    if (!userProfile) {
      return null;
    }

    const result: MeResponse = {
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
