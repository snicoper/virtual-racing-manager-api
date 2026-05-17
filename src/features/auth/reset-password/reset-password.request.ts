import { IsString, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(8)
  confirmPassword!: string;
}
