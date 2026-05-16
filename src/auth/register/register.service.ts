import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterRequest } from './register.request';
import { RegisterResponse } from './resgister.response';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterRequest): Promise<RegisterResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    this.validatePassword(dto.password, dto.confirmPassword);
    await this.validateUserDoesNotExist(normalizedEmail);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: passwordHash,
      },
    });

    const registerResponse: RegisterResponse = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return registerResponse;
  }

  private validatePassword(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: {
          confirmPassword: ['confirmPassword must match password'],
        },
      });
    }
  }

  private async validateUserDoesNotExist(email: string): Promise<void | null> {
    const errors: Record<string, string[]> = {};

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if (existingUser === null) {
      return null;
    }

    if (existingUser.email === email) {
      errors.email = ['Email is already in use'];
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors,
      });
    }
  }
}
