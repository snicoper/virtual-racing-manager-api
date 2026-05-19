import { IsString, MinLength } from 'class-validator';
import { IsEmailField } from '../../../core/validators/field.validators';

export class RegisterRequest {
  @IsEmailField()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(8)
  confirmPassword!: string;
}
