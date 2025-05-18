import axios from 'axios';

//Ruta de controladores
export const URL_USUARIOSCONTROLLER = '/usuarios';
export const URL_OMNIBUSCONTROLLER = '/buses';
export const URL_ASIENTOSCONTROLLER = '/asientos';
export const URL_LOCALIDADESCONTROLLER = '/localidades';
export const URL_VIAJESCONTROLLER = '/viajes';
export const URL_COMPRASCONTROLLER = '/compras';
export const API = 'http://localhost:8080';

//RUTA API
export default axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 8000,
});