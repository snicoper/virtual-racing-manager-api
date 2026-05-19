import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsSlugField } from '../../../core/validators/field.validators';

export class UpdateRequest {
  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsSlugField()
  slug!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
