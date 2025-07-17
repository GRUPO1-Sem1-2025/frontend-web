import axios, { URL_OMNIBUSCONTROLLER } from "../Configuraciones/axios.js";

export const obtenerOmnibus = async () => {
  try {
    const response = await axios.get(
      `${URL_OMNIBUSCONTROLLER}/obtenerOmnibusActivos`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener ómnibus:", error);
    return [];
  }
};
