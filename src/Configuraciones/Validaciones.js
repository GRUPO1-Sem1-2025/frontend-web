export const NOMBRE_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
export const CORREO_REGEX = /^[a-zA-Z0-9.*%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
export const SOLODIGITOS_REGEX = /^\d+$/;
export const NOTNULL_REGEX = /.+/;