import { Injectable } from '@nestjs/common';
import { TokenService } from '../core/services/token.service';

@Injectable()
export class LogoutService {
  constructor(private readonly tokenService: TokenService) {}

  async handle(userId: string): Promise<void> {
    await this.tokenService.clearRefreshToken(userId);
  }
}
