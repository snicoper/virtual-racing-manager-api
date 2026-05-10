import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto } from './register.dto';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedUsername = dto.username.toLocaleLowerCase().trim();

    this.validatePassword(dto.password, dto.confirmPassword);
    await this.validateUserDoesNotExist(normalizedEmail, normalizedUsername);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash: passwordHash,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  private validatePassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: {
          confirmPassword: ['confirmPassword must match password'],
        },
      });
    }
  }

  private async validateUserDoesNotExist(email: string, username: string) {
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

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors,
      });
    }
  }
}
