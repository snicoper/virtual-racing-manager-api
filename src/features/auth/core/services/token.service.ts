import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppConfig } from '../../../../core/config/app.config';
import { UserWithAuthorization } from '../../../../core/database/includes/user-with-authorization.include';
import { RefreshToken } from '../contracts/refresh-token.contract';
import { TokenResponse } from '../contracts/token.response';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async issueTokens(user: UserWithAuthorization): Promise<TokenResponse> {
    const accessToken = await this.createAccessToken(user);

    const { refreshToken, refreshTokenHash } =
      await this.createRefreshToken(user);

    await this.authRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      expiresIn: AppConfig.jwt.expiresInMinutes * 60,
    };
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.authRepository.updateRefreshTokenHash(userId, null);
  }

  private async createAccessToken(
    user: UserWithAuthorization,
  ): Promise<string> {
    const roles = user.roles.map((userRole) => userRole.role.name);

    const permissions = [
      ...new Set(
        user.roles.flatMap((userRole) =>
          userRole.role.permissions.map(
            (rolePermission) => rolePermission.permission.name,
          ),
        ),
      ),
    ];

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions,
    };

    return this.jwtService.signAsync(payload);
  }

  private async createRefreshToken(user: User): Promise<RefreshToken> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: AppConfig.jwt.refreshSecret,
      expiresIn: `${AppConfig.jwt.refreshExpiresInDays}d`,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    return {
      refreshToken,
      refreshTokenHash,
    };
  }
}
