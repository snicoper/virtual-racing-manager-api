import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from '../core/repositories/auth.repository';
import { MeResponse } from './me.response';

@Injectable()
export class MeService {
  constructor(private readonly authRepository: AuthRepository) {}

  async getMe(userId: string): Promise<MeResponse> {
    const user = await this.authRepository.findById(userId);

    if (user === null) {
      throw new NotFoundException({
        code: 'notFound',
        message: 'User not found',
      });
    }

    const meResponse: MeResponse = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return meResponse;
  }
}
