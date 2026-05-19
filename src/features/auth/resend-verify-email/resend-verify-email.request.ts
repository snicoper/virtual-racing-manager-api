import { IsEmailField } from '../../../core/validators/field.validators';

export class ResendVerifyEmailRequest {
  @IsEmailField()
  email!: string;
}
