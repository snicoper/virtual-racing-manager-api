import { BadRequestException, Injectable } from '@nestjs/common';
import { UserTokenService } from '../core/services/user-token.service';
import { ResetPasswordRequest } from './reset-password.request';

@Injectable()
export class ResetPasswordService {
  constructor(private readonly userTokenService: UserTokenService) {}

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    if (request.password !== request.confirmPassword) {
      throw new BadRequestException({
        errors: {
          password: ['passwordMismatch'],
        },
      });
    }

    await this.userTokenService.consumePasswordResetToken(
      request.token,
      request.password,
    );
  }
}
