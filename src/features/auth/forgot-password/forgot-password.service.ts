import { Injectable } from '@nestjs/common';
import { ForgotPasswordRequest } from './forgot-password.request';

@Injectable()
export class ForgotPasswordService {
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {}
}
