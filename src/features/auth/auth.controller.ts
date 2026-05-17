import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from './core/contracts/jwt-payload.contract';
import { TokenResponse } from './core/contracts/token.response';
import { JwtAuthGuard } from './core/guards/jwt-auth/jwt-auth.guard';
import { JwtRefreshTokenGuard } from './core/guards/jwt-auth/jwt-refresh.guard';
import { ForgotPasswordRequest } from './forgot-password/forgot-password.request';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { LoginRequest } from './login/login.request';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { MeResponse } from './me/me.response';
import { MeService } from './me/me.service';
import { RefreshTokenRequest } from './refresh-token/refresh-token.request';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterRequest } from './register/register.request';
import { RegisterResponse } from './register/register.response';
import { RegisterService } from './register/register.service';
import { ResendVerifyEmailRequest } from './resend-verify-email/resend-verify-email.request';
import { ResendVerifyEmailResponse } from './resend-verify-email/resend-verify-email.response';
import { ResendVerifyEmailService } from './resend-verify-email/resend-verify-email.service';
import { ResetPasswordRequest } from './reset-password/reset-password.request';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { VerifyEmailRequest } from './verify-email/verify-email.request';
import { VerifyEmailService } from './verify-email/verify-email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly meService: MeService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendVerifyEmailService: ResendVerifyEmailService,
    private readonly logoutService: LogoutService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  me(@Req() req: Request & { user: JwtPayload }): Promise<MeResponse> {
    return this.meService.getMe(req.user.sub);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterRequest): Promise<RegisterResponse> {
    return this.registerService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  verifyEmail(@Body() dto: VerifyEmailRequest): Promise<void> {
    return this.verifyEmailService.verifyEmail(dto);
  }

  @Post('resend-verify-email')
  @HttpCode(HttpStatus.CREATED)
  resendVerificationEmail(
    @Body() dto: ResendVerifyEmailRequest,
  ): Promise<ResendVerifyEmailResponse> {
    return this.resendVerifyEmailService.resendVerificationEmail(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() dto: ForgotPasswordRequest): Promise<void> {
    return this.forgotPasswordService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() dto: ResetPasswordRequest): Promise<void> {
    return this.resetPasswordService.resetPassword(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequest): Promise<TokenResponse> {
    return this.loginService.login(dto);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refresh(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: RefreshTokenRequest,
  ): Promise<TokenResponse> {
    return this.refreshTokenService.refreshToken(dto, req.user.sub);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request & { user: JwtPayload }): Promise<void> {
    await this.logoutService.logout(req.user.sub);
  }
}
