import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Get(':id')
  findOne(): string {
    return 'This action returns a single user';
  }

  @Post()
  create(): string {
    return 'This action adds a new user';
  }
}
