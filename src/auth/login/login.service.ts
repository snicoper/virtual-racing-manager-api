import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { TokenService } from '../token.service';
import { LoginRequest } from './login.request';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: TokenService,
  ) {}

  async login(dto: LoginRequest) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    const tokenResponse = await this.authService.issueTokens(user);

    return tokenResponse;
  }
}
