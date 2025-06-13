import { useEffect, useRef } from "react";
import axios from "../../Configuraciones/axios.js";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";
const URL_USUARIOSCONTROLLER = "/usuarios";

export default function Stripe() {
  const calledRef = useRef(false);
  const ivString = localStorage.getItem("esIdayVuelta");
  const esIdaVuelta = ivString === "true";

  const compraIda = localStorage.getItem("compraIda");
  const compraVuelta = localStorage.getItem("compraVuelta");

  useEffect(() => {
    const cancelarCompra = async () => {
      if (calledRef.current) return; // ya se llamó, salimos
      calledRef.current = true;
      try {
        await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
          params: {
            idCompra: compraIda,
          },
        });

        if (esIdaVuelta) {
          try {
            await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
              params: {
                idCompra: compraVuelta,
              },
            });
          } catch (error) {
            console.error("Error cancelando vuelta:", error);
          }
        }
      } catch (error) {
        console.error("Error cancelando ida:", error);
      }
    };

    cancelarCompra();

    localStorage.removeItem("dataIDA");
    localStorage.removeItem("dataVUELTA");
    localStorage.removeItem("esIdayVuelta");
    localStorage.removeItem("compraIda");
    localStorage.removeItem("compraVuelta");
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
            La compra fue cancelada
          </h1>
        </div>
      </div>

      <Footer />
    </>
  );
}
