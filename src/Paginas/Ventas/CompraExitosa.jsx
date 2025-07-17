import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";
import axios from "../../Configuraciones/axios.js";
import imprimirPasaje from "./printPasaje.jsx";
const URL_USUARIOSCONTROLLER = "/usuarios";

export default function Print() {
  const location = useLocation();
  const idaString = localStorage.getItem("dataIDA");
  const ida = JSON.parse(idaString);
  const pasajeDataIda = ida.pasajeData;

  const vueltaString = localStorage.getItem("dataVUELTA");
  const vuelta = JSON.parse(vueltaString);
  const pasajeDataVuelta = vuelta.pasajeData;

  const ivString = localStorage.getItem("esIdayVuelta");

  const esIdaVuelta = ivString === "true";
  const compraIda = localStorage.getItem("compraIda");
  const compraVuelta = localStorage.getItem("compraVuelta");
  const calledRef = useRef(false);

  const refPago = localStorage.getItem("pi_id");
  useEffect(() => {
    localStorage.removeItem("pagoIniciado");
    const confirmarCompra = async () => {
      if (calledRef.current) return; // ya se llamó, salimos
      calledRef.current = true;
      try {
        if (!compraIda) {
          throw new Error("compraIda no está disponible");
        }
        await axios.post(
          `${URL_USUARIOSCONTROLLER}/cambiarEstadoCompra`,
          compraIda,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (esIdaVuelta) {
          try {
            if (!compraVuelta) {
              throw new Error("compraIda es null");
            }
            await axios.post(
              `${URL_USUARIOSCONTROLLER}/cambiarEstadoCompra`,
              compraVuelta,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            const params = new URLSearchParams();
            params.append("idCompra", compraVuelta);
            params.append("referencia", refPago);

            await axios.post(
              `${URL_USUARIOSCONTROLLER}/guardarReferenciaPago`,
              params
            );
          } catch (error) {
            console.error("Error compra Vuelta:", error);
          }
        }
        const params = new URLSearchParams();
        params.append("idCompra", compraIda);
        params.append("referencia", refPago);
        console.log("ref:", refPago);
        console.log("4", compraIda, refPago);
        await axios.post(
          `${URL_USUARIOSCONTROLLER}/guardarReferenciaPago`,
          params
        );
      } catch (error) {
        console.error("Error compra Ida:", error);
      }
    };

    confirmarCompra();

    localStorage.removeItem("dataIDA");
    localStorage.removeItem("dataVUELTA");
    localStorage.removeItem("esIdayVuelta");
    localStorage.removeItem("compraIda");
    localStorage.removeItem("compraVuelta");
    localStorage.removeItem("pi_id");
    console.log("--END--");
  }, []);

  return (
    <>
      <NavBar />
      <div style={{ position: "relative", width: "100%", height: "75vh" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            width: "90%",
            maxWidth: "600px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "2rem",
            }}
          >
            Gracias por su compra!
          </h1>
          <h4>Pasaje/s de Ida </h4>
          {/*<Pasaje pasaje={pasajeDataIda} />*/}
          <Button
            label="Descargar pasajes"
            icon="pi pi-download"
            onClick={() => imprimirPasaje(pasajeDataIda)}
          />
          {esIdaVuelta && (
            <>
              <h4 style={{ marginTop: "2rem" }}>Pasaje/s de Vuelta </h4>
              <Button
                label="Descargar pasajes"
                icon="pi pi-download"
                onClick={() => imprimirPasaje(pasajeDataVuelta)}
              />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
