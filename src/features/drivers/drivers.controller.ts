import { Controller, Get, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  findAll(): any[] {
    return this.driversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.driversService.findOne(Number(id));
  }
}
