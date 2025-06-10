import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "../../Configuraciones/axios.js";
const URL_BUSESCONTROLLER = "/buses";
const URL_VIAJESCONTROLLER = "/viajes";

const cargarAsientos = async (idBus) => {
  /*try {
    const response = await axios.get(
      `${URL_BUSESCONTROLLER}/obtenerOmnibusActivos`
    );
    const omnibus = response.data.find((o) => o.id === idBus);
    return omnibus.cant_asientos;
  } catch {}*/
  try {
    const response = await axios.get(
      `${URL_BUSESCONTROLLER}/obtenerOmnibusPorId`,
      {
        params: { idBus },
      }
    );
    console.log(response.data); // Aquí recibís el objeto DtoBus
    return response.data.cant_asientos;
  } catch {
    console.log("Cagada");
  }
};

const cargarAsientosLibres = async (idViaje) => {
  try {
    const response = await axios.get(
      `${URL_VIAJESCONTROLLER}/obtenerAsientosDisponibles`,
      {
        params: {
          idViaje: idViaje,
        },
      }
    );
    return response.data || [];
  } catch {}
};

export default function SeleccionAsientos({
  seleccionados,
  setSeleccionados,
  idBus,
  idViaje,
}) {
  const [cantAsientos, setCantAsientos] = useState(0);
  const [asientosLibres, setAsientosLibres] = useState([]); //useState(0);
  const columnasPorLado = 2;
  const asientosOcupados = [];
  for (let i = 1; i <= cantAsientos; i++) {
    if (!asientosLibres.includes(i)) {
      asientosOcupados.push(i);
    }
  }

  useEffect(() => {
    const fetchAsientos = async () => {
      const cantidad = await cargarAsientos(idBus);
      setCantAsientos(cantidad);
    };

    fetchAsientos();
  }, [idBus]);

  useEffect(() => {
    const fetchLibres = async () => {
      const aLibres = await cargarAsientosLibres(idViaje);
      setAsientosLibres(aLibres);
    };

    fetchLibres();
  }, [idViaje]);

  const toggleAsiento = (asiento) => {
    if (asientosOcupados.includes(asiento)) return; // Si el asiento ya esta ocupado no hace nada

    setSeleccionados((prev) =>
      prev.includes(asiento)
        ? prev.filter((a) => a !== asiento)
        : [...prev, asiento]
    );
  };

  const renderAsientos = () => {
    const filas = Math.ceil(cantAsientos / (2 * columnasPorLado)); // Redondea para arriba, filas completas necesarias + 1
    console.log("desde func", cantAsientos);
    console.log("aLibres", asientosLibres);
    console.log("filas: ", filas);
    const rows = [];
    let asientoCount = 1; // Inicia el contador de asientos

    for (let i = 0; i < filas; i++) {
      const row = [];
      console.log("fila: ", i);
      console.log("row: ", row);

      // Lado izquierdo
      for (let j = 0; j < columnasPorLado; j++) {
        if (asientoCount > cantAsientos) break;
        const asiento = asientoCount++;
        console.log("cont:Asiento: ", asiento);
        const ocupado = asientosOcupados.includes(asiento);
        const seleccionado = seleccionados.includes(asiento);

        row.push(
          <Button
            key={asiento}
            label={String(asiento)}
            severity={
              ocupado ? "danger" : seleccionado ? "success" : "secondary"
            }
            disabled={ocupado}
            onClick={() => toggleAsiento(asiento)}
            style={{
              margin: "4px",
              width: "50px", // Fijamos un ancho fijo para todos los botones
              display: "flex",
              justifyContent: "center",
              alignItems: "center", // Asegura que el contenido esté centrado
              height: "50px", // Mantiene la altura fija
            }}
          />
        );
      }

      // Pasillo (espacio vacío)
      row.push(<div key={`pasillo-${i}`} style={{ width: "30px" }}></div>);

      // Lado derecho

      for (let j = 0; j < columnasPorLado; j++) {
        const final = false;
        if (asientoCount > cantAsientos) {
          // Agrega un botón invisible para mantener el espacio
          row.push(
            <div
              key={`fake-left-${i}-${j}`}
              style={{ width: "50px", margin: "4px" }}
            ></div>
          );
        } else {
          const asiento = asientoCount++;
          console.log("cont_siento: ", asiento);
          const ocupado = asientosOcupados.includes(asiento);
          const seleccionado = seleccionados.includes(asiento);

          row.push(
            <Button
              key={asiento}
              label={String(asiento)}
              severity={
                ocupado ? "danger" : seleccionado ? "success" : "secondary"
              }
              disabled={ocupado}
              onClick={() => toggleAsiento(asiento)}
              style={{
                margin: "4px",
                width: "50px", // Fijamos un ancho fijo para todos los botones
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Asegura que el contenido esté centrado
                height: "50px", // Mantiene la altura fija
              }}
            />
          );
        }
      }

      rows.push(
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          {row}
        </div>
      );
    }
    console.log("rows: ", rows);
    return rows;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Seleccioná tus asientos</h2>
      {renderAsientos()}
      <div style={{ marginTop: "20px" }}>
        <strong>Seleccionados:</strong>{" "}
        {seleccionados.length > 0 ? seleccionados.join(", ") : "Ninguno"}
      </div>
    </div>
  );
}
