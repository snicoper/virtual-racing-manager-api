import { Injectable, NotFoundException } from '@nestjs/common';
import { MeResponse } from './me.response';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user === null) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const meResponse: MeResponse = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return meResponse;
  }
}
