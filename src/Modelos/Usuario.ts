export class Usuario {
    constructor(
      public id: number,
      public nombre: string,
      public apellido: string,
      public fechaNac: Date,
      public email: string,
      public categoria: string,
      public ci: string,
      public fechaCreacion: Date,
      public password: string,
      public activo: boolean,
      public rol: number
    ) {}
  }
  