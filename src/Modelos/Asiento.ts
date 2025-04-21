import { OmnibusAsiento } from './OmnibusAsiento'

export class Asiento {
    constructor(
      public id: number,
      public nro: number,
      public omnibusAsientos: OmnibusAsiento[]
    ) {}
  }
  