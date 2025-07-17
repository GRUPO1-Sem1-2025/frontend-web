import axios, { URL_LOCALIDADESCONTROLLER } from "../Configuraciones/axios.js";

export const obtenerLocalidades = async () => {
  try {
    const response = await axios.get(
      `${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener localidades:", error);
    return [];
  }
};

export const obtenerLocalidadesAgrupadas = async (token) => {
  try {
    const response = await axios.get(
      `${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    data.sort((a, b) => a.departamento.localeCompare(b.departamento));

    const departamentosMap = {};

    data.forEach(({ id, nombre, departamento }) => {
      if (!departamentosMap[departamento]) {
        departamentosMap[departamento] = [];
      }

      departamentosMap[departamento].push({
        name: nombre,
        code: id,
        cname: nombre,
      });
    });

    Object.keys(departamentosMap).forEach((dep) => {
      departamentosMap[dep].sort((a, b) => a.name.localeCompare(b.name));
    });

    const localidadesAgrupadas = Object.entries(departamentosMap).map(
      ([departamento, localidades]) => ({
        name: departamento,
        code: departamento,
        localidades: localidades,
      })
    );

    return localidadesAgrupadas;
  } catch (error) {
    console.error("Error al obtener localidades agrupadas:", error);
    return [];
  }
};
