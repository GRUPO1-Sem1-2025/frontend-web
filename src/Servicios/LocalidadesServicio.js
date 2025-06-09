import axios, { URL_LOCALIDADESCONTROLLER } from '../Configuraciones/axios.js';

export const obtenerLocalidades = async () => {
    try {
        const response = await axios.get(`${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`);
        console.log("Cantidad de localidades:", response.data.length);
        return response.data;
    } catch (error) {
        console.error("Error al obtener localidades:", error);
        return [];
    }
};

export const obtenerLocalidadesAgrupadas = async () => {
    try {
        const response = await axios.get(`${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`);
        const data = response.data;

        data.sort((a, b) => a.departamento.localeCompare(b.departamento));

        const departamentosMap = {};

        data.forEach(({ id, nombre, departamento }) => {
            if (!departamentosMap[departamento]) {
                departamentosMap[departamento] = [];
            }

            departamentosMap[departamento].push({
                label: nombre,
                value: { id, nombre }
            });
        });

        const localidadesAgrupadas = Object.entries(departamentosMap).map(([dep, items]) => ({
            label: dep,
            items
        }));
        console.log("Cantidad de localidades:", response.data.length);
        return localidadesAgrupadas;
    } catch (error) {
        console.error("Error al obtener localidades agrupadas:", error);
        return [];
    }
};