import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { userWithAuthorizationInclude } from '../../database/includes/user-with-authorization.include';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const requestUser = request.user;

    if (!requestUser) {
      return false;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: requestUser.sub },
      include: userWithAuthorizationInclude,
    });

    if (!user) {
      return false;
    }

    const userPermissions = [
      ...new Set(
        user.roles.flatMap((userRole) =>
          userRole.role.permissions.map(
            (rolePermission) => rolePermission.permission.name,
          ),
        ),
      ),
    ];

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
