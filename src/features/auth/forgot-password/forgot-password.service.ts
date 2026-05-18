import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppConfig } from '../../../core/config/app.config';
import { AuthRepository } from '../core/repositories/auth.repository';
import { UserTokenMailService } from '../core/services/user-token-mail.service';
import { UserTokenService } from '../core/services/user-token.service';
import { UserTokenType } from '../core/types/user-token.type';
import { ForgotPasswordRequest } from './forgot-password.request';
import { ForgotPasswordResponse } from './forgot-password.response';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userTokenService: UserTokenService,
    private readonly userMailTokenService: UserTokenMailService,
  ) {}

  async handle(
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.authRepository.findByEmail(request.email);
    const forgotPasswordResponse: ForgotPasswordResponse = {};

    if (!user) {
      return forgotPasswordResponse;
    }

    const verificationToken = await this.createTokenAndSendEmail(
      user,
      request.email,
    );

    if (!AppConfig.isProduction) {
      forgotPasswordResponse.verificationToken = verificationToken;
    }

    return forgotPasswordResponse;
  }

  private async createTokenAndSendEmail(
    user: User,
    email: string,
  ): Promise<string> {
    const token = await this.userTokenService.createUserToken(
      user.id,
      email,
      UserTokenType.PASSWORD_RESET,
    );

    await this.userMailTokenService.sendPasswordResetEmail(token, email);

    return token;
  }
}
