// ... importaciones previas ...
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../Componentes/NavBar.jsx";
import { useRef, useState, useEffect } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import Asientos from "./SeleccionAsiento.jsx";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import TiempoRestante from "./TiempoRestante.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import axios from "../../Configuraciones/axios.js";
import useAuth from "../../Hooks/useAuth.jsx";

const URL_USUARIOSCONTROLLER = "/usuarios";

export default function VentaPasaje() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const stepperRef = useRef(null);
  const { auth } = useAuth();
  const location = useLocation();

  // Estado del usuario
  const [datosUsuario, setDatosUsuario] = useState([]);

  useEffect(() => {
    axios
      .get(`${URL_USUARIOSCONTROLLER}/emails/`, {
        params: { email: auth?.email },
      })
      .then((res) => setDatosUsuario(res.data))
      .catch((err) => {
        console.error("Error al cargar datos del usuario", err);
      });
  }, []);

  // Datos recibidos de Home
  const {
    esIdaVuelta,
    lugarOrigen,
    lugarDestino,
    fechaIda,
    fechaVuelta,
    viajes,
    viajesVuelta,
  } = location.state || {};

  // Estados generales
  const [viajeElegido, setViajeElegido] = useState("");
  const [viajeElegidoVuelta, setViajeElegidoVuelta] = useState("");
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [asientosVuelta, setAsientosVuelta] = useState([]);
  const [compraIda, setCompraIda] = useState("");
  const [compraVuelta, setCompraVuelta] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Datos estructurados para Stripe
  const [pasajeDataIda, setPasajeDataIda] = useState({
    nombre: "",
    apellido: "",
    ci: "",
    destino: lugarDestino,
    origen: lugarOrigen,
    asientos: [],
    precio: "",
    fechaSalida: fechaIda,
    horaSalida: "",
    fechaArribo: "",
    horaArribo: "",
    via: "web",
  });

  const [pasajeDataVuelta, setPasajeDataVuelta] = useState({
    nombre: "",
    apellido: "",
    ci: "",
    destino: lugarOrigen,
    origen: lugarDestino,
    asientos: [],
    precio: "",
    fechaSalida: fechaVuelta,
    horaSalida: "",
    fechaArribo: "",
    horaArribo: "",
    via: "web",
  });

  // Utilidad para mostrar fechas correctamente
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    if (typeof fecha === "string") return fecha;
    return new Date(fecha).toLocaleDateString();
  };

  const handleStart = () => {
    setShowTimer(true);
    setStartTimer(true);
  };

  const cancelarCompra = async () => {
    try {
      await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
        params: { idCompra: compraIda },
      });
      if (esIdaVuelta) {
        await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
          params: { idCompra: compraVuelta },
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Error cancelando compra:", error);
    }
  };

  return (
    <>
      <NavBar />
      <Toast ref={toast} />
      {showTimer && (
        <TiempoRestante
          minutes={10}
          start={startTimer}
          onFinish={() => setVisible(true)}
        />
      )}

      <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }} linear>
          {/* Paso 1: Selección de viaje ida */}
          <StepperPanel header={esIdaVuelta ? "Viaje de Ida" : "Viaje"}>
            <h5>Origen: {lugarOrigen}</h5>
            <h5>Destino: {lugarDestino}</h5>
            <h5>Fecha: {formatearFecha(fechaIda)}</h5>
            <Divider />
            <DataTable
              value={viajes}
              selectionMode="radiobutton"
              selection={viajeElegido}
              onSelectionChange={(e) => setViajeElegido(e.value)}
              dataKey="viajeId"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
              <Column field="busId" header="Omnibus" />
              <Column field="horaInicio" header="Hora Salida" />
              <Column field="horaFin" header="Hora Llegada" />
              <Column field="precioPasaje" header="Precio" />
            </DataTable>
            <div className="flex pt-4 justify-content-end">
              <Button label="Cancelar" severity="danger" onClick={() => navigate("/")} />
              <Button
                label="Siguiente"
                onClick={() => {
                  setPasajeDataIda((prev) => ({
                    ...prev,
                    nombre: datosUsuario.nombre,
                    apellido: datosUsuario.apellido,
                    ci: datosUsuario.ci,
                    horaArribo: viajeElegido.horaFin,
                    horaSalida: viajeElegido.horaInicio,
                    fechaArribo: formatearFecha(viajeElegido.fechaFin),
                    precio: viajeElegido.precioPasaje,
                  }));
                  stepperRef.current.nextCallback();
                }}
                disabled={!viajeElegido}
              />
            </div>
          </StepperPanel>

          {/* Paso 2: Selección asiento ida */}
          <StepperPanel header="Asientos Ida">
            <Asientos
              seleccionados={asientosSeleccionados}
              setSeleccionados={setAsientosSeleccionados}
              idBus={viajeElegido.busId}
              idViaje={viajeElegido.viajeId}
            />
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Atrás"
                onClick={() => {
                  setViajeElegido("");
                  stepperRef.current.prevCallback();
                }}
              />
              <Button
                label="Reservar"
                loading={loading}
                onClick={() => {
                  setPasajeDataIda((prev) => ({
                    ...prev,
                    asientos: asientosSeleccionados,
                  }));
                  setLoading(true);
                  axios
                    .post(`${URL_USUARIOSCONTROLLER}/comprarPasaje`, {
                      usuarioId: datosUsuario.id,
                      viajeId: viajeElegido.viajeId,
                      numerosDeAsiento: asientosSeleccionados,
                      estadoCompra: "RESERVADA",
                    })
                    .then((res) => {
                      setCompraIda(res.data.idCompra);
                      setLoading(false);
                      handleStart();
                      stepperRef.current.nextCallback();
                    })
                    .catch((err) => {
                      setLoading(false);
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail:
                          "Algunos asientos ya no están disponibles: " +
                          err.response.data.asientosOcupados,
                        life: 3000,
                      });
                    });
                }}
                disabled={asientosSeleccionados.length === 0}
              />
            </div>
          </StepperPanel>

          {/* Paso 3 y 4: Vuelta (si aplica) */}
          {esIdaVuelta && (
            <>
              <StepperPanel header="Viaje de Vuelta">
                <h5>Origen: {lugarDestino}</h5>
                <h5>Destino: {lugarOrigen}</h5>
                <h5>Fecha: {formatearFecha(fechaVuelta)}</h5>
                <Divider />
                <DataTable
                  value={viajesVuelta}
                  selectionMode="radiobutton"
                  selection={viajeElegidoVuelta}
                  onSelectionChange={(e) => setViajeElegidoVuelta(e.value)}
                  dataKey="viajeId"
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
                  <Column field="busId" header="Omnibus" />
                  <Column field="horaInicio" header="Hora Salida" />
                  <Column field="horaFin" header="Hora Llegada" />
                  <Column field="precioPasaje" header="Precio" />
                </DataTable>
                <div className="flex pt-4 justify-content-end">
                  <Button label="Cancelar" onClick={() => navigate("/")} />
                  <Button
                    label="Siguiente"
                    onClick={() => {
                      setPasajeDataVuelta((prev) => ({
                        ...prev,
                        nombre: datosUsuario.nombre,
                        apellido: datosUsuario.apellido,
                        ci: datosUsuario.ci,
                        horaArribo: viajeElegidoVuelta.horaFin,
                        horaSalida: viajeElegidoVuelta.horaInicio,
                        fechaArribo: formatearFecha(viajeElegidoVuelta.fechaFin),
                        precio: viajeElegidoVuelta.precioPasaje,
                      }));
                      stepperRef.current.nextCallback();
                    }}
                    disabled={!viajeElegidoVuelta}
                  />
                </div>
              </StepperPanel>

              <StepperPanel header="Asientos Vuelta">
                <Asientos
                  seleccionados={asientosVuelta}
                  setSeleccionados={setAsientosVuelta}
                  idBus={viajeElegidoVuelta.busId}
                  idViaje={viajeElegidoVuelta.viajeId}
                />
                <div className="flex pt-4 justify-content-between">
                  <Button
                    label="Atrás"
                    onClick={() => {
                      setViajeElegidoVuelta("");
                      stepperRef.current.prevCallback();
                    }}
                  />
                  <Button
                    label="Reservar"
                    onClick={() => {
                      setPasajeDataVuelta((prev) => ({
                        ...prev,
                        asientos: asientosVuelta,
                      }));
                      setLoading(true);
                      axios
                        .post(`${URL_USUARIOSCONTROLLER}/comprarPasaje`, {
                          usuarioId: datosUsuario.id,
                          viajeId: viajeElegidoVuelta.viajeId,
                          numerosDeAsiento: asientosVuelta,
                          estadoCompra: "RESERVADA",
                        })
                        .then((res) => {
                          setCompraVuelta(res.data.idCompra);
                          setLoading(false);
                          stepperRef.current.nextCallback();
                        })
                        .catch((err) => {
                          setLoading(false);
                          toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail:
                              "Asientos ocupados: " +
                              err.response.data.asientosOcupados,
                            life: 3000,
                          });
                        });
                    }}
                    disabled={asientosVuelta.length !== asientosSeleccionados.length}
                  />
                </div>
              </StepperPanel>
            </>
          )}

          {/* Paso Final */}
          <StepperPanel header="Resumen y Pago">
            <Card title="Viaje de Ida">
              <p><strong>Fecha de Salida:</strong> {formatearFecha(pasajeDataIda.fechaSalida)}</p>
              <p><strong>Hora de Salida:</strong> {pasajeDataIda.horaSalida}</p>
              <p><strong>Fecha de Arribo:</strong> {pasajeDataIda.fechaArribo}</p>
              <p><strong>Hora de Arribo:</strong> {pasajeDataIda.horaArribo}</p>
              <p><strong>Asientos:</strong> {asientosSeleccionados.join(", ")}</p>
            </Card>

            {esIdaVuelta && (
              <Card title="Viaje de Vuelta">
                <p><strong>Fecha de Salida:</strong> {formatearFecha(pasajeDataVuelta.fechaSalida)}</p>
                <p><strong>Hora de Salida:</strong> {pasajeDataVuelta.horaSalida}</p>
                <p><strong>Fecha de Arribo:</strong> {pasajeDataVuelta.fechaArribo}</p>
                <p><strong>Hora de Arribo:</strong> {pasajeDataVuelta.horaArribo}</p>
                <p><strong>Asientos:</strong> {asientosVuelta.join(", ")}</p>
              </Card>
            )}

            <div className="flex pt-4 justify-content-start">
              <Button label="Cancelar" severity="secondary" onClick={cancelarCompra} />
              <Button
                label="Pagar"
                onClick={() => {
                  navigate("./../Stripe", {
                    state: {
                      compraIda,
                      compraVuelta,
                      pasajeDataIda,
                      esIdaVuelta,
                      pasajeDataVuelta,
                    },
                  });
                }}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </>
  );
}
