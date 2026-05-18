import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { userWithAuthorizationInclude } from '../../../core/database/includes/user-with-authorization.include';
import { TokenResponse } from '../core/contracts/token.response';
import { TokenService } from '../core/services/token.service';
import { LoginRequest } from './login.request';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: TokenService,
  ) {}

  async login(dto: LoginRequest): Promise<TokenResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      include: userWithAuthorizationInclude,
    });

    await this.validateLoginAccount(dto.password, user);

    const tokenResponse = await this.authService.issueTokens(user!);

    return tokenResponse;
  }

  private async validateLoginAccount(
    password: string,
    user: User | null,
  ): Promise<void> {
    if (!user) {
      throw new ConflictException({
        code: 'invalidCredentials',
        detail: 'Incorrect email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ConflictException({
        code: 'invalidCredentials',
        detail: 'Incorrect email or password',
      });
    }

    if (!user.isActive) {
      throw new ConflictException({
        code: 'userNotActive',
        detail: 'User is not active',
      });
    }

    if (!user.emailVerifiedAt) {
      throw new ConflictException({
        code: 'emailNotVerified',
        detail: 'Email is not verified',
      });
    }
  }
}
