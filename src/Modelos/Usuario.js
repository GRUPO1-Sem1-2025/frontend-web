// Usuario.js

/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nombre
 * @property {string} apellido
 * @property {Date} fechaNac
 * @property {string} email
 * @property {string} categoria
 * @property {string} ci
 * @property {Date} fechaCreacion
 * @property {string} password
 * @property {boolean} activo
 * @property {number} rol
 */

export class Usuario {
  constructor(
    id,
    nombre,
    apellido,
    fechaNac,
    email,
    categoria,
    ci,
    fechaCreacion,
    password,
    activo,
    rol
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.fechaNac = fechaNac;
    this.email = email;
    this.categoria = categoria;
    this.ci = ci;
    this.fechaCreacion = fechaCreacion;
    this.password = password;
    this.activo = activo;
    this.rol = rol;
  }
}

/**
 * Crea un objeto plano con solo los campos necesarios para el registro.
 * @param {{ nombre: string, email: string, password: string }} datos
 * @returns {Object}
 */
export function crearUsuarioBasico({ nombre, apellido, email, password }) {
  return {
    nombre,
    apellido,
    email,
    password
  };
}
