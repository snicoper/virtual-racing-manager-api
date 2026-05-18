import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string): Promise<UserProfile | null> {
    return await this.prisma.userProfile.findUnique({ where: { slug } });
  }
}
