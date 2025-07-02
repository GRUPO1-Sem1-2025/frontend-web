import React, { useState, useEffect, useRef } from "react";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "../../Configuraciones/axios.js";
import "./styles.css";

const URL_VIAJESCONTROLLER = "/viajes";

export default function Calificar({ viaje, usuario, cerrar, onMostrarToast }) {
  const [calificacion, setCalificacion] = useState(null);
  const [comentario, setComentario] = useState("");
  const [yaCalificado, setYaCalificado] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerCalificacion = async () => {
      try {
        const response = await axios.get(
          `${URL_VIAJESCONTROLLER}/verCalificacionUsuario`,
          {
            params: {
              idViaje: viaje,
              idUsuario: usuario,
            },
          }
        );

        const calificacionRealizada = response.data;
        if (calificacionRealizada?.calificacion != null) {
          setCalificacion(calificacionRealizada.calificacion);
          setComentario(calificacionRealizada.comentario);
          setYaCalificado(true);
        }
      } catch (error) {
        console.error(
          "Error al obtener calificación del viaje:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    obtenerCalificacion();
  }, []);

  const calificarViaje = async () => {
    try {
      const response = await axios.post(
        `${URL_VIAJESCONTROLLER}/calificarViaje`,
        {
          calificacion: calificacion,
          comentario: {
            idUsuario: usuario,
            calificacion: calificacion,
            comentario: comentario,
          },
          idViaje: viaje,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Mensaje: ", response.data);
    } catch (error) {
      console.error("Error en la respuesta:", error.response.data);
    }
  };

  const handleCalificar = () => {
    if (calificacion === null) {
      onMostrarToast("Debe seleecionar la calificiación", "error", "Error");
    } else if (comentario === "") {
      onMostrarToast("Debe ingresar un comentario", "error", "Error");
    } else {
      calificarViaje();
      cerrar();
      onMostrarToast(
        "Calificación enviada correctamente",
        "success",
        "Gracias!"
      );
    }
  };
  if (loading) {
    return (
      <div className="card flex justify-content-center">
        <ProgressSpinner
          className="spinner-cargando"
          style={{ width: "50px", height: "50px", stroke: "yellow" }}
          strokeWidth="4"
          fill="transparent"
          animationDuration=".5s"
        />
      </div>
    );
  }
  return yaCalificado ? (
    <div className="card flex justify-content-center">
      <h3 style={{ paddingBottom: "20px" }}>Viaje ya calificado</h3>
      <label htmlFor="calificar">Calificacion</label>
      <Rating
        value={calificacion}
        readOnly
        cancel={false}
        style={{ paddingBottom: "20px" }}
      />
      <InputTextarea value={comentario} disabled rows={5} cols={45} />
    </div>
  ) : (
    <div className="card flex justify-content-center">
      <label htmlFor="calificar">Calificacion</label>
      <Rating
        id="calificar"
        value={calificacion}
        onChange={(e) => setCalificacion(e.value)}
        cancel={false}
      />
      <label
        htmlFor="comentario"
        style={{ display: "block", paddingTop: "25px" }}
      >
        Comentario
      </label>
      <InputTextarea
        id="comentario"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={5}
        cols={45}
      />
      <div
        className="card flex flex-wrap justify-content-center gap-3"
        style={{ paddingTop: "25px" }}
      >
        <Button
          label="Guardar"
          severity="success"
          style={{ marginRight: "10px" }}
          onClick={handleCalificar}
        />
        <Button label="Cancelar" severity="danger" onClick={cerrar} />
      </div>
    </div>
  );
}
