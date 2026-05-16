import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TokenResponse } from '../core/contracts/token.response';
import { LoginRequest } from './login.request';
import { TokenService } from '../core/services/token.service';

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
    });

    if (!user) {
      throw new ConflictException({
        code: 'invalid_credentials',
        detail: 'Incorrect email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ConflictException({
        code: 'invalid_credentials',
        detail: 'Incorrect email or password',
      });
    }

    const tokenResponse = await this.authService.issueTokens(user);

    return tokenResponse;
  }
}
