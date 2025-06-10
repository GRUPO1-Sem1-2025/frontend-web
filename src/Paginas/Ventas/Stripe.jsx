import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../Configuraciones/axios.js";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";
import { Button } from "primereact/button";
const URL_USUARIOSCONTROLLER = "/usuarios";

export default function Stripe() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    compraIda,
    compraVuelta,
    pasajeDataIda,
    esIdaVuelta,
    pasajeDataVuelta,
  } = location.state || {};

  console.log("Compra Ida:", compraIda);
  console.log("Compra Vuelta:", compraVuelta);
  console.log("pasajeData: ", pasajeDataIda);
  console.log("ida?vuelta: ", esIdaVuelta);
  const cancelarCompra = async () => {
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
          navigate("/");
        } catch (error) {
          console.error("Error cancelando vuelta:", error);
        }
      }
      navigate("/");
    } catch (error) {
      console.error("Error cancelando ida:", error);
    }
  };

  const confirmarCompra = async () => {
    try {
      await axios.post(
        `${URL_USUARIOSCONTROLLER}/cambiarEstadoCompra`,
        compraIda,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (esIdaVuelta) {
        try {
          await axios.post(
            `${URL_USUARIOSCONTROLLER}/cambiarEstadoCompra`,
            compraVuelta,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error("Error compra Vuelta:", error);
        }
      }
      navigate("./../CompraExitosa", {
        state: {
          compraIda,
          compraVuelta,
          pasajeDataIda,
          esIdaVuelta,
          pasajeDataVuelta,
        },
      });
    } catch (error) {
      console.error("Error compra Ida:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div>
        <Button
          label="Confirmar compra"
          severity="success"
          onClick={confirmarCompra}
        />
        <Button
          label="Cancelar compra"
          severity="danger"
          onClick={cancelarCompra}
        />
      </div>
      <Footer />
    </>
  );
}
