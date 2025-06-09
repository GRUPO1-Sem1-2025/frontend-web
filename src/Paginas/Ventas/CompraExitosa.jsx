import { useEffect } from "react";
import Pasaje from "./ImprimirPasajes.jsx";
import { useLocation } from "react-router-dom";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";

export default function Print() {
  const location = useLocation();
  const { pasajeDataIda, esIdaVuelta, pasajeDataVuelta } = location.state || {};

  useEffect(() => {
    console.log("Location state recibido:", location.state);
    console.log("Datos del pasaje:", pasajeDataIda);
    console.log("Asientos:", pasajeDataIda?.asientos); // Evita error si no está definido
    console.log("Datos del pasaje vuelta:", pasajeDataVuelta);
  }, [location.state]); // Solo se ejecuta cuando cambia el state de la ruta

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
          <Pasaje pasaje={pasajeDataIda} />

          {esIdaVuelta && (
            <>
              <h4 style={{ marginTop: "2rem" }}>Pasaje/s de Vuelta </h4>
              <Pasaje pasaje={pasajeDataVuelta} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
