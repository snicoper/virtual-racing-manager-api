import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriversModule } from './drivers/drivers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DriversModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
