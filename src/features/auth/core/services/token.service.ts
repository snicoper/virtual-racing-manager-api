import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { AppConfig } from '../../../../core/config/app.config';
import { UserWithAuthorization } from '../../../../core/database/includes/user-with-authorization.include';
import { RefreshToken } from '../contracts/refresh-token.contract';
import { TokenResponse } from '../contracts/token.response';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async issueTokens(user: UserWithAuthorization): Promise<TokenResponse> {
    const accessToken = await this.createAccessToken(user);

    const { refreshToken, refreshTokenHash } =
      await this.createRefreshToken(user);

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
