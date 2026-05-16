import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UserTokenType } from '../types/user-token.type';
import { PrismaService } from '../../../../../prisma/prisma.service';

@Injectable()
export class UserTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmailVerificationToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.prisma.userToken.create({
      data: {
        userId,
        email,
        type: UserTokenType.EMAIL_VERIFICATION,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    return token;
  }
}
