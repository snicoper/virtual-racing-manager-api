import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { DriversModule } from './features/drivers/drivers.module';
import { UserProfilesModule } from './features/user-profiles/user-profiles.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DriversModule,
    UserProfilesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
