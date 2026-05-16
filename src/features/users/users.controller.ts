import { Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
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
