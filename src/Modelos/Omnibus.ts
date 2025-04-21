import { OmnibusAsiento } from './OmnibusAsiento'

export class Omnibus {
    constructor(
      public id: number,
      public marca: string,
      public activo: boolean,
      public omnibusAsientos: OmnibusAsiento[],
      public cant_asientos: number
    ) {}
  }
  