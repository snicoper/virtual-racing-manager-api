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
import { LoginRequest } from './login/login.request';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { MeResponse } from './me/me.response';
import { MeService } from './me/me.service';
import { RefreshTokenRequest } from './refresh-token/refresh-token.request';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterRequest } from './register/register.request';
import { RegisterService } from './register/register.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly meService: MeService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: JwtPayload }): Promise<MeResponse> {
    return this.meService.getMe(req.user.sub);
  }

  @Post('register')
  register(@Body() dto: RegisterRequest): Promise<MeResponse> {
    return this.registerService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequest): Promise<TokenResponse> {
    return this.loginService.login(dto);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
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
