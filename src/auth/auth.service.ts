import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: {
          confirmPassword: ['confirmPassword must match password'],
        },
      });
    }

    const userConflictErrors = await this.getUserConflictErrors(
      dto.email,
      dto.username,
    );

    if (userConflictErrors !== null) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: userConflictErrors,
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  private async getUserConflictErrors(
    email: string,
    username: string,
  ): Promise<Record<string, string[]> | null> {
    const errors: Record<string, string[]> = {};

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser === null) {
      return null;
    }

    if (existingUser.email === email) {
      errors.email = ['Email is already in use'];
    }

    if (existingUser.username === username) {
      errors.username = ['Username is already in use'];
    }

    return errors;
  }
}
