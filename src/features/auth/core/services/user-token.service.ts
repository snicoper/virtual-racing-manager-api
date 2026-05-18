import { ConflictException, Injectable } from '@nestjs/common';
import { UserToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { UserTokenRepository } from '../repositories/user-token.repository';
import { UserTokenType } from '../types/user-token.type';

@Injectable()
export class UserTokenService {
  constructor(private readonly userTokenRepository: UserTokenRepository) {}

  async createUserToken(
    userId: string,
    email: string,
    userTokenType: UserTokenType,
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.userTokenRepository.create(
      userId,
      email,
      userTokenType,
      tokenHash,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );

    return token;
  }

  async consumeToken(token: string, type: UserTokenType): Promise<void> {
    const userToken = await this.getUserToken(token, type);

    await this.userTokenRepository.updateUsedAtNow(userToken.id);
  }

  async consumeEmailVerificationToken(token: string): Promise<void> {
    const userToken = await this.getUserToken(
      token,
      UserTokenType.EMAIL_VERIFICATION,
    );

    await this.userTokenRepository.consumeEmailVerificationToken(
      userToken.id,
      userToken.userId!,
    );
  }

  async consumePasswordResetToken(
    token: string,
    password: string,
  ): Promise<void> {
    const userToken = await this.getUserToken(
      token,
      UserTokenType.PASSWORD_RESET,
    );

    const passwordHash = await bcrypt.hash(password, 10);

    await this.userTokenRepository.consumePasswordResetToken(
      userToken.id,
      userToken.userId!,
      passwordHash,
    );
  }

  private async getUserToken(
    token: string,
    type: UserTokenType,
  ): Promise<UserToken> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const userToken = await this.userTokenRepository.findActiveTokenByTokenHash(
      tokenHash,
      type,
    );

    if (!userToken) {
      throw new ConflictException('Invalid or expired token');
    }

    return userToken;
  }
}
