import axios, { URL_USUARIOSCONTROLLER } from "../Configuraciones/axios.js";

export const UsuariosServicio = {
  listarTodos: async (token) => {
    try {
      const response = await axios.get(
        `${URL_USUARIOSCONTROLLER}/listarTodos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  },
};
