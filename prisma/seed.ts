import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { Permission } from '../src/core/authorization/permission.enum';
import { Role } from '../src/core/authorization/role.enum';
import { AppConfig } from '../src/core/config/app.config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: AppConfig.databaseUrl,
  }),
});

const allPermissions = Object.values(Permission);
const rolePermissions: Record<Role, Permission[]> = {
  [Role.SuperAdmin]: allPermissions,

  [Role.Admin]: allPermissions,

  [Role.User]: [
    Permission.UsersRead,
    Permission.UsersUpdate,
    Permission.UserProfilesRead,
    Permission.UserProfilesUpdate,
    Permission.OrganizationsRead,
    Permission.ChampionshipsRead,
  ],

  [Role.OrganizationOwner]: [
    Permission.OrganizationsRead,
    Permission.OrganizationsUpdate,
    Permission.ChampionshipsCreate,
    Permission.ChampionshipsRead,
    Permission.ChampionshipsUpdate,
    Permission.ChampionshipsDelete,
    Permission.OrganizationUsersRead,
    Permission.OrganizationUsersUpdate,
  ],

  [Role.OrganizationAdmin]: [
    Permission.OrganizationsRead,
    Permission.ChampionshipsCreate,
    Permission.ChampionshipsRead,
    Permission.ChampionshipsUpdate,
    Permission.OrganizationUsersRead,
  ],

  [Role.OrganizationMember]: [
    Permission.OrganizationsRead,
    Permission.ChampionshipsRead,
  ],
};

/*********************************
 * Permissions
 ********************************/

async function seedPermissions(): Promise<void> {
  for (const permission of allPermissions) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: { name: permission },
    });
  }
}

/*********************************
 * Roles
 ********************************/

async function seedRoles(): Promise<void> {
  const roles: Role[] = Object.values(Role);

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
}

/*********************************
 * RolePermissions
 ********************************/

async function seedRolePermissions(): Promise<void> {
  for (const [roleName, permissions] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: {
        name: roleName,
      },
    });

    for (const permissionName of permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: {
          name: permissionName,
        },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

/*********************************
 * Users
 ********************************/

const seedUsersData = [
  'alice@example.com',
  'bob@example.com',
  'carol@example.com',
  'lexi@example.com',
];

async function seedUsers(): Promise<void> {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  for (const email of seedUsersData) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        emailVerifiedAt: new Date(),
      },
    });
  }
}

async function seedUserProfiles(): Promise<void> {
  const alice = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'alice@example.com',
    },
  });

  await prisma.userProfile.upsert({
    where: {
      userId: alice.id,
    },

    update: {},

    create: {
      userId: alice.id,
      slug: 'alice',
      nickname: 'Alice',
      firstName: 'Alice',
      lastName: 'Johnson',
      country: 'USA',
      bio: 'Sim racing enthusiast',
      avatarUrl: null,
    },
  });
}

/*********************************
 * UserRoles
 ********************************/

async function seedUserRoles(): Promise<void> {
  const userRolesMap: Record<string, Role[]> = {
    'alice@example.com': [Role.User, Role.Admin, Role.SuperAdmin],
    'bob@example.com': [Role.User, Role.Admin],
    'carol@example.com': [
      Role.User,
      Role.OrganizationOwner,
      Role.OrganizationAdmin,
      Role.OrganizationMember,
    ],
    'lexi@example.com': [Role.User, Role.OrganizationMember],
  };

  for (const [email, roles] of Object.entries(userRolesMap)) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
    });

    for (const roleName of roles) {
      const role = await prisma.role.findUniqueOrThrow({
        where: { name: roleName },
      });

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
  }
}

/*********************************
 * Organizations
 ********************************/

async function seedOrganization(): Promise<void> {
  const carol = await prisma.user.findUniqueOrThrow({
    where: { email: 'carol@example.com' },
  });

  const lexi = await prisma.user.findUniqueOrThrow({
    where: { email: 'lexi@example.com' },
  });

  const ownerRole = await prisma.role.findUniqueOrThrow({
    where: { name: Role.OrganizationOwner },
  });

  const memberRole = await prisma.role.findUniqueOrThrow({
    where: { name: Role.OrganizationMember },
  });

  const organization = await prisma.organization.upsert({
    where: { slug: 'nitro-racing' },
    update: {},
    create: {
      name: 'Nitro Racing',
      slug: 'nitro-racing',
    },
  });

  await prisma.organizationUser.upsert({
    where: {
      userId_organizationId: {
        userId: carol.id,
        organizationId: organization.id,
      },
    },
    update: {
      roleId: ownerRole.id,
    },
    create: {
      userId: carol.id,
      organizationId: organization.id,
      roleId: ownerRole.id,
    },
  });

  await prisma.organizationUser.upsert({
    where: {
      userId_organizationId: {
        userId: lexi.id,
        organizationId: organization.id,
      },
    },
    update: {
      roleId: memberRole.id,
    },
    create: {
      userId: lexi.id,
      organizationId: organization.id,
      roleId: memberRole.id,
    },
  });

  await prisma.championship.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: 'gt3-sprint-series',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'GT3 Sprint Series',
      slug: 'gt3-sprint-series',
      description: 'Demo championship for Nitro Racing.',
    },
  });
}

async function main(): Promise<void> {
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await seedUsers();
  await seedUserProfiles();
  await seedUserRoles();
  await seedOrganization();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
