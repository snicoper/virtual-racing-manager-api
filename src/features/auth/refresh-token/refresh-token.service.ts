import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TokenResponse } from '../core/contracts/token.response';
import { RefreshTokenRequest } from './refresh-token.request';
import { TokenService } from '../core/services/token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async refreshToken(
    refreshTokenRequest: RefreshTokenRequest,
    userId: string,
  ): Promise<TokenResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user?.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidRefreshToken = await bcrypt.compare(
      refreshTokenRequest.refreshToken,
      user.refreshTokenHash,
    );

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.tokenService.issueTokens(user);
  }
}
