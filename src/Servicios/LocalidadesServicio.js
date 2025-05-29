import axios, { URL_LOCALIDADESCONTROLLER } from '../Configuraciones/axios.js';

export const obtenerLocalidades = async () => {
    try {
        const response = await axios.get(`${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`);
        console.log("servicio: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener localidades:", error);
        return [];
    }
};