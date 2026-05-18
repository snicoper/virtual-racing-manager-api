import { Prisma } from '@prisma/client';

export const userWithAuthorizationInclude =
  Prisma.validator<Prisma.UserInclude>()({
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    },
  });

export type UserWithAuthorization = Prisma.UserGetPayload<{
  include: typeof userWithAuthorizationInclude;
}>;
