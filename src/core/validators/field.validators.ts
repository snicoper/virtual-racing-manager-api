import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegexUtils } from '../utils/regex.utils';

export function IsEmailField(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Matches(RegexUtils.email, {
      message: 'isEmail',
    }),
  );
}

export function IsSlugField(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Matches(RegexUtils.slug, {
      message: 'isSlug',
    }),
  );
}
