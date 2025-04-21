import { Omnibus } from './Omnibus'
import { Asiento } from './Asiento'

export class OmnibusAsiento {
  constructor(
    public id: number,
    public omnibus: Omnibus,
    public asiento: Asiento,
    public estado: boolean
  ) {}
}
