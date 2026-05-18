import { IsString } from 'class-validator';

export class GetBySlugRequest {
  @IsString()
  slug!: string;
}
