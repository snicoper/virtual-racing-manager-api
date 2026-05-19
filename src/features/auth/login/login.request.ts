import { IsString, MinLength } from 'class-validator';
import { IsEmailField } from '../../../core/validators/field.validators';

export class LoginRequest {
  @IsEmailField()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
