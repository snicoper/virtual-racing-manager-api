import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppConfig } from '../../../core/config/app.config';
import { AuthRepository } from '../core/repositories/auth.repository';
import { UserTokenMailService } from '../core/services/user-token-mail.service';
import { UserTokenService } from '../core/services/user-token.service';
import { UserTokenType } from '../core/types/user-token.type';
import { RegisterRequest } from './register.request';
import { RegisterResponse } from './register.response';

@Injectable()
export class RegisterService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userTokenService: UserTokenService,
    private readonly userMailTokenService: UserTokenMailService,
  ) {}

  async handle(request: RegisterRequest): Promise<RegisterResponse> {
    const normalizedEmail = request.email.trim().toLowerCase();

    this.validatePassword(request.password, request.confirmPassword);
    await this.validateUserDoesNotExist(normalizedEmail);

    const passwordHash = await bcrypt.hash(request.password, 10);
    const user = await this.createUser(normalizedEmail, passwordHash);

    const verificationToken = await this.createTokenAndSendEmail(
      user,
      normalizedEmail,
    );

    const registerResponse: RegisterResponse = {};

    if (!AppConfig.isProduction) {
      registerResponse.verificationToken = verificationToken;
    }

    return registerResponse;
  }

  private async createUser(email: string, passwordHash: string): Promise<User> {
    return this.authRepository.createNewUser(email, passwordHash);
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

  private validatePassword(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new BadRequestException({
        errors: {
          confirmPassword: ['passwordMismatch'],
        },
      });
    }
  }

  private async validateUserDoesNotExist(email: string): Promise<void | null> {
    const errors: Record<string, string[]> = {};

    const user = await this.authRepository.findByEmail(email);

    if (user) {
      errors.email = ['userAlreadyExists'];
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({ errors });
    }
  }
}
