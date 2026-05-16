import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { AppConfig } from '../../core/config/app.config';
import { AuthController } from './auth.controller';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { MeService } from './me/me.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterService } from './register/register.service';
import { TokenService } from './core/services/token.service';
import { UserTokenService } from './core/services/user-token.service';
import { JwtStrategy } from './core/strategies/jwt.strategy';

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
  providers: [
    RegisterService,
    LoginService,
    JwtStrategy,
    MeService,
    RefreshTokenService,
    TokenService,
    LogoutService,
    UserTokenService,
  ],
})
export class AuthModule {}
