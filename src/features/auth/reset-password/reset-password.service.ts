import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from './reset-password.request';

@Injectable()
export class ResetPasswordService {
  async resetPassword(request: ResetPasswordRequest): Promise<void> {}
}
