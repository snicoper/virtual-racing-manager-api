import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { AppConfig } from '../../core/config/app.config';
import { MailModule } from '../../core/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './core/repositories/auth.repository';
import { UserTokenRepository } from './core/repositories/user-token.repository';
import { TokenService } from './core/services/token.service';
import { UserTokenMailService } from './core/services/user-token-mail.service';
import { UserTokenService } from './core/services/user-token.service';
import { JwtRefreshStrategy } from './core/strategies/jwt-refresh.strategy';
import { JwtStrategy } from './core/strategies/jwt.strategy';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { MeService } from './me/me.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterService } from './register/register.service';
import { ResendVerifyEmailService } from './resend-verify-email/resend-verify-email.service';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { VerifyEmailService } from './verify-email/verify-email.service';

const jwtExpiresIn =
  `${AppConfig.jwt.expiresInMinutes}m` as SignOptions['expiresIn'];

@Module({
  imports: [
    MailModule,
    JwtModule.register({
      secret: AppConfig.jwt.secret,
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    AuthRepository,
    UserTokenRepository,
    TokenService,
    UserTokenService,
    UserTokenMailService,
    RegisterService,
    LoginService,
    MeService,
    LogoutService,
    VerifyEmailService,
    RefreshTokenService,
    ResendVerifyEmailService,
    ForgotPasswordService,
    ResetPasswordService,
  ],
})
export class AuthModule {}
