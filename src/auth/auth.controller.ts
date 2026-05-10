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
import { JwtPayload } from './contracts/jwt-payload.contract';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { LoginRequest } from './login/login.request';
import { LoginService } from './login/login.service';
import { MeService } from './me/me.service';
import { RefreshTokenRequest } from './refresh-token/refresh-token.request';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterDto } from './register/register.dto';
import { RegisterService } from './register/register.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly meService: MeService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: JwtPayload }) {
    return this.meService.getMe(req.user.sub);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequest) {
    return this.loginService.login(dto);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  refresh(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: RefreshTokenRequest,
  ) {
    return this.refreshTokenService.refreshToken(
      dto.refreshToken,
      req.user.sub,
    );
  }
}
