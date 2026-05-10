import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppConfig } from '../../common/config/app.config';
import { RefreshToken } from '../contracts/refresh-token.contract';
import { TokenResponse } from '../contracts/token.response';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async issueTokens(user: User): Promise<TokenResponse> {
    const accessToken = await this.createAccessToken(user);

    const { refreshToken, refreshTokenHash } = await this.createRefreshToken();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: AppConfig.jwt.expiresInMinutes * 60,
    };
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  private async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  private async createRefreshToken(): Promise<RefreshToken> {
    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    return {
      refreshToken,
      refreshTokenHash,
    };
  }
}
