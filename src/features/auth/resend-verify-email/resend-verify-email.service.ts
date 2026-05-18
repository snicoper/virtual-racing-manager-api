import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppConfig } from '../../../core/config/app.config';
import { AuthRepository } from '../core/repositories/auth.repository';
import { UserTokenMailService } from '../core/services/user-token-mail.service';
import { UserTokenService } from '../core/services/user-token.service';
import { UserTokenType } from '../core/types/user-token.type';
import { ResendVerifyEmailRequest } from './resend-verify-email.request';
import { ResendVerifyEmailResponse } from './resend-verify-email.response';

@Injectable()
export class ResendVerifyEmailService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userTokenService: UserTokenService,
    private readonly userMailTokenService: UserTokenMailService,
  ) {}

  async handle(
    dto: ResendVerifyEmailRequest,
  ): Promise<ResendVerifyEmailResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user =
      await this.authRepository.findUnverifiedByEmail(normalizedEmail);

    const resentVerifyEmailResponse: ResendVerifyEmailResponse = {};

    if (!user) {
      return resentVerifyEmailResponse;
    }

    const verificationToken = await this.createTokenAndSendEmail(
      user,
      normalizedEmail,
    );

    if (!AppConfig.isProduction) {
      resentVerifyEmailResponse.verificationToken = verificationToken;
    }

    return resentVerifyEmailResponse;
  }

  private async createTokenAndSendEmail(
    user: User,
    email: string,
  ): Promise<string> {
    const token = await this.userTokenService.createUserToken(
      user.id,
      email,
      UserTokenType.EMAIL_VERIFICATION,
    );
    await this.userMailTokenService.sendVerificationEmail(token, email);

    return token;
  }
}
