import { IsEmailField } from '../../../core/validators/field.validators';

export class ForgotPasswordRequest {
  @IsEmailField()
  email!: string;
}
