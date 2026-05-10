import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DriversModule } from './drivers/drivers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, DriversModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
