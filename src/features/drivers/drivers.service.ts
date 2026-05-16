import { Injectable } from '@nestjs/common';

@Injectable()
export class DriversService {
  private readonly drivers = [
    { id: 1, name: 'Salva', nationality: 'Spain' },
    { id: 2, name: 'Max Verstappen', nationality: 'Netherlands' },
    { id: 3, name: 'Fernando Alonso', nationality: 'Spain' },
  ];

  findAll(): any[] {
    return this.drivers;
  }

  findOne(id: number): any {
    return this.drivers.find((driver) => driver.id === id);
  }
}
