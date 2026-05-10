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
import { LoginDto } from './login/login.dto';
import { LoginService } from './login/login.service';
import { RegisterDto } from './register/register.dto';
import { RegisterService } from './register/register.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: JwtPayload }) {
    return req.user;
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.loginService.login(dto);
  }
}
