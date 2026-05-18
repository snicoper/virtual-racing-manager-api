import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenResponse } from '../core/contracts/token.response';
import { AuthRepository } from '../core/repositories/auth.repository';
import { TokenService } from '../core/services/token.service';
import { RefreshTokenRequest } from './refresh-token.request';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async handle(
    refreshTokenRequest: RefreshTokenRequest,
    userId: string,
  ): Promise<TokenResponse> {
    const user = await this.authRepository.findByIdWithAuthorization(userId);

    if (!user || !user?.refreshTokenHash) {
      throw new UnauthorizedException({
        code: 'invalidRefreshToken',
        message: 'Invalid refresh token',
      });
    }

    const isValidRefreshToken = await bcrypt.compare(
      refreshTokenRequest.refreshToken,
      user.refreshTokenHash,
    );

    if (!isValidRefreshToken) {
      throw new UnauthorizedException({
        code: 'invalidRefreshToken',
        message: 'Invalid refresh token',
      });
    }

    return this.tokenService.issueTokens(user);
  }
}
