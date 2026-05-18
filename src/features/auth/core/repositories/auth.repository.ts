import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Role } from '../../../../core/authorization/role.enum';
import {
  UserWithAuthorization,
  userWithAuthorizationInclude,
} from '../../../../core/database/includes/user-with-authorization.include';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  /** User -> Roles[] -> Permissions[] */
  async findByIdWithAuthorization(
    id: string,
  ): Promise<UserWithAuthorization | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: userWithAuthorizationInclude,
    });
  }

  /** User -> Roles[] -> Permissions[] */
  async findByEmailWithAuthorization(
    email: string,
  ): Promise<UserWithAuthorization | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: userWithAuthorizationInclude,
    });
  }

  async findUnverifiedByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
        emailVerifiedAt: null,
      },
    });
  }

  async createNewUser(email: string, passwordHash: string): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      const role = await tx.role.findUnique({
        where: {
          name: Role.User,
        },
      });

      if (role === null) {
        throw new InternalServerErrorException('Role not found');
      }

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      return user;
    });
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }
}
