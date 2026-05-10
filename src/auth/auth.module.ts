import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { AppConfig } from '../common/config/app.config';
import { AuthController } from './auth.controller';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const jwtExpiresIn =
  `${AppConfig.jwt.expiresInMinutes}m` as SignOptions['expiresIn'];

@Module({
  imports: [
    JwtModule.register({
      secret: AppConfig.jwt.secret,
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [RegisterService, LoginService, JwtStrategy],
})
export class AuthModule {}
