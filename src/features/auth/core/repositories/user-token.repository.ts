import { Injectable } from '@nestjs/common';
import { UserToken } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { UserTokenType } from '../types/user-token.type';

@Injectable()
export class UserTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveTokenByTokenHash(
    tokenHash: string,
    type: UserTokenType,
  ): Promise<UserToken | null> {
    return this.prisma.userToken.findFirst({
      where: {
        tokenHash,
        type: type,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });
  }

  async create(
    userId: string,
    email: string,
    userTokenType: UserTokenType,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<UserToken> {
    return this.prisma.userToken.create({
      data: {
        userId,
        email,
        type: userTokenType,
        tokenHash,
        expiresAt,
      },
    });
  }

  async updateUsedAtNow(userTokenId: string): Promise<void> {
    await this.prisma.userToken.update({
      where: { id: userTokenId },
      data: { usedAt: new Date() },
    });
  }

  async consumeEmailVerificationToken(
    userTokenId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.userToken.update({
        where: { id: userTokenId },
        data: { usedAt: new Date() },
      }),

      this.prisma.user.update({
        where: { id: userId },
        data: { emailVerifiedAt: new Date() },
      }),
    ]);
  }

  async consumePasswordResetToken(
    userTokenId: string,
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.userToken.update({
        where: { id: userTokenId },
        data: { usedAt: new Date() },
      }),

      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash, refreshTokenHash: null },
      }),
    ]);
  }
}
