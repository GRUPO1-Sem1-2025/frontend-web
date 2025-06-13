import { useNavigate } from "react-router-dom";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";
import { useLocation } from "react-router-dom";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import Asientos from "./SeleccionAsiento.jsx";
import "./styles.css";
import axios from "../../Configuraciones/axios.js";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AuthContext from "../../Context/AuthProvider.jsx";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import TiempoRestante from "./TiempoRestante.jsx";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Stripe } from "./Stripe.jsx";
const URL_USUARIOSCONTROLLER = "/usuarios";

export default function BasicDemo() {
  const [loading, setLoading] = useState(false);
  const stepperRef = useRef(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false); // Manejo Mensaje Fin de Reserva

  const footerContent = (
    <div>
      <Button
        label="Ok"
        onClick={() => navigate("/")}
        autoFocus
        loading={loading}
      />
    </div>
  );

  const handlePagar = async (total) => {
    try {
      const url = await Stripe(total);
      window.location.href = url; // redirige a Stripe
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      alert("Hubo un error al iniciar el pago.");
    }
  };

  // Estado compartido
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [asientosVuelta, setAsientosVuelta] = useState([]);
  const [datosUsuario, setDatosUsuario] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log("auth", auth);
    console.log("mail", auth.email);
    axios
      .get(`${URL_USUARIOSCONTROLLER}/emails/`, {
        params: {
          email: auth.email,
        },
      })
      .then((response) => {
        setDatosUsuario(response.data.OK);
      })
      .catch((err) => {
        setError("Error al cargar datos del usuario");
        console.error(err);
      });
  }, []);

  // Datos de la busqueda
  const location = useLocation();
  const [viajeElegido, setViajeElegido] = useState("");
  const [viajeElegidoVuelta, setViajeElegidoVuelta] = useState("");
  const [compraIda, setCompraIda] = useState("");
  const [compraVuelta, setCompraVuelta] = useState("");

  const {
    //pasajes,
    esIdaVuelta,
    lugarOrigen,
    idOrigen,
    lugarDestino,
    idDestino,
    fechaIda,
    fechaVuelta,
    viajes,
    viajesVuelta,
  } = location.state || {};

  const [pasajeDataIda, setPasajeDataIda] = useState({
    nombre: "",
    apellido: "",
    ci: "",
    destino: lugarDestino,
    origen: lugarOrigen,
    asientos: [],
    precio: "",
    fechaSalida: fechaIda.toLocaleDateString(),
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
    asientos: "",
    precio: "",
    fechaSalida: esIdaVuelta ? fechaVuelta.toLocaleDateString() : "",
    horaSalida: "",
    fechaArribo: "",
    horaArribo: "",
    via: "web",
  });
  const [showTimer, setShowTimer] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  const handleStart = () => {
    setShowTimer(true);
    setStartTimer(true);
  };
  const handleFinish = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Se acabo el tiempo de su reserva",
      life: 3000,
    });
  };

  const formateaFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    const fechaFormateada = `${day}/${month}/${year}`; // "19/06/2025"
    return fechaFormateada;
  };

  const cancelarCompra = async (idIda, idVuelta) => {
    try {
      await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
        params: {
          idCompra: idIda,
        },
      });

      if (esIdaVuelta) {
        try {
          await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
            params: {
              idCompra: idVuelta,
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

  return (
    <>
      <NavBar />
      <Toast ref={toast} />
      {console.log(viajes)}
      {console.log("Datos user: ", datosUsuario)}
      <h2>
        {showTimer && (
          <TiempoRestante
            minutes={10}
            start={startTimer}
            onFinish={() => setVisible(true)}
          />
        )}
      </h2>
      <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }} linear>
          <StepperPanel
            header={esIdaVuelta ? "Seleccion Viaje de Ida" : "Seleccion Viaje"}
          >
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <h5>Origen: {lugarOrigen}</h5>
                <h5>Destino: {lugarDestino}</h5>
                <h5>Fecha:{fechaIda.toLocaleDateString()}</h5>
                <Divider />
              </div>
              <div className="card">
                <DataTable
                  value={viajes}
                  selectionMode="radiobutton"
                  selection={viajeElegido}
                  onSelectionChange={(e) => setViajeElegido(e.value)}
                  dataKey="viajeId"
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column
                    selectionMode="single"
                    headerStyle={{ width: "3rem" }}
                  ></Column>
                  <Column field="busId" header="Omnibus"></Column>
                  <Column field="horaInicio" header="Hora Salida"></Column>
                  <Column
                    field="cantAsientosDisponibles"
                    header="Asientos Disponibles"
                  ></Column>
                  <Column field="horaFin" header="Hora Llegada"></Column>
                  <Column field="fechaFin" header="Hora Llegada"></Column>
                  <Column field="precioPasaje" header="Precio"></Column>
                </DataTable>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end">
              <Button
                label="  Cancelar"
                severity="danger"
                icon="pi pi-times"
                onClick={() => navigate("/")}
              />
              <Button
                label="Siguiente"
                className="next-button"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => {
                  console.log(
                    "fechaFormateada",
                    formateaFecha(viajeElegido.fechaFin)
                  );

                  setPasajeDataIda((prev) => ({
                    ...prev,
                    nombre: datosUsuario.nombre,
                    apellido: datosUsuario.apellido,
                    ci: datosUsuario.ci,
                    horaArribo: viajeElegido.horaFin,
                    horaSalida: viajeElegido.horaInicio,
                    fechaArribo: formateaFecha(viajeElegido.fechaFin),
                    precio: viajeElegido.precioPasaje,
                  }));

                  stepperRef.current.nextCallback();
                  console.log(pasajeDataIda);
                }}
                disabled={viajeElegido === ""}
              />
            </div>
          </StepperPanel>
          <StepperPanel
            header={
              esIdaVuelta ? "Seleccion Asiento de Ida" : "Seleccion Asiento"
            }
          >
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Asientos
                  seleccionados={asientosSeleccionados}
                  setSeleccionados={setAsientosSeleccionados}
                  idBus={viajeElegido.busId}
                  idViaje={viajeElegido.viajeId}
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Atras"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => {
                  setViajeElegido("");
                  setAsientosSeleccionados([]);
                  stepperRef.current.prevCallback();
                }}
              />
              <Button
                label="Siguiente"
                className="next-button"
                icon="pi pi-arrow-right"
                iconPos="right"
                loading={loading}
                onClick={() => {
                  setPasajeDataIda((prev) => ({
                    ...prev,
                    asientos: asientosSeleccionados,
                  }));
                  setLoading(true);
                  console.log("Click comprado", asientosSeleccionados);
                  console.log("usuarioId: ", datosUsuario.id);
                  console.log("viajeId: ", viajeElegido.viajeId);
                  console.log("asientos numero: ", asientosSeleccionados);
                  axios
                    .post(`${URL_USUARIOSCONTROLLER}/comprarPasaje`, {
                      usuarioId: datosUsuario.id,
                      viajeId: viajeElegido.viajeId,
                      numerosDeAsiento: asientosSeleccionados,
                      estadoCompra: "RESERVADA",
                    })
                    .then((res) => {
                      console.log("Compra exitosa:", res.data);
                      //startTimer;
                      //setShowTimer(true);
                      handleStart();
                      setCompraIda(res.data.idCompra);
                      setLoading(false);
                      stepperRef.current.nextCallback();
                    })
                    .catch((err) => {
                      console.error(
                        "Error al comprar:",
                        err.response.data.asientosOcupados,
                        err.response?.data || err.message
                      );
                      setLoading(false);
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail:
                          "Algunos asientos elegidos ya no estan disponibles:" +
                          err.response.data.asientosOcupados,
                        life: 3000,
                      });
                    });
                }}
                disabled={asientosSeleccionados.length === 0} // Boton deshabilitado si no tiene asientos elegidos
              />
            </div>
          </StepperPanel>
          {esIdaVuelta && (
            <StepperPanel header="Selecciona Viaje de Vuelta">
              <div className="flex flex-column h-12rem">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <h5>Origen: {lugarDestino}</h5>
                  <h5>Destino: {lugarOrigen}</h5>
                  <h5>
                    Fecha:
                    {fechaVuelta.toLocaleDateString()}
                  </h5>
                </div>
                <div className="card">
                  <DataTable
                    value={viajesVuelta}
                    selectionMode="radiobutton"
                    selection={viajeElegidoVuelta}
                    onSelectionChange={(e) => setViajeElegidoVuelta(e.value)}
                    dataKey="viajeId"
                    tableStyle={{ minWidth: "50rem" }}
                  >
                    <Column
                      selectionMode="single"
                      headerStyle={{ width: "3rem" }}
                    ></Column>
                    <Column field="busId" header="Omnibus"></Column>
                    <Column field="horaInicio" header="Hora Salida"></Column>
                    <Column
                      field="cantAsientosDisponibles"
                      header="Asientos Disponibles"
                    ></Column>
                    <Column field="horaFin" header="Hora Llegada"></Column>
                    <Column field="precioPasaje" header="Precio"></Column>
                  </DataTable>
                </div>
              </div>
              <div className="flex pt-4 justify-content-end">
                <Button
                  label="  Cancelar"
                  severity="danger"
                  icon="pi pi-times"
                  onClick={() => navigate("/")}
                />
                <Button
                  label="Siguiente"
                  className="next-button"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => {
                    setPasajeDataVuelta((prev) => ({
                      ...prev,
                      nombre: datosUsuario.nombre,
                      apellido: datosUsuario.apellido,
                      ci: datosUsuario.ci,
                      horaArribo: viajeElegidoVuelta.horaFin,
                      horaSalida: viajeElegidoVuelta.horaInicio,
                      fechaArribo: formateaFecha(viajeElegidoVuelta.fechaFin),
                      precio: viajeElegidoVuelta.precioPasaje,
                    }));
                    stepperRef.current.nextCallback();
                    console.log(pasajeDataIda);
                  }}
                  disabled={viajeElegidoVuelta === ""}
                />
              </div>
            </StepperPanel>
          )}
          {esIdaVuelta && (
            <StepperPanel header="Seleccion Asiento de Vuelta">
              <div className="flex flex-column h-12rem">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <Asientos
                    seleccionados={asientosVuelta}
                    setSeleccionados={setAsientosVuelta}
                    idBus={viajeElegidoVuelta.busId}
                    idViaje={viajeElegidoVuelta.viajeId}
                  />
                </div>
              </div>
              <div className="flex pt-4 justify-content-between">
                <Button
                  label="Atras"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  onClick={() => {
                    setViajeElegidoVuelta("");
                    setAsientosVuelta([]);
                    stepperRef.current.prevCallback();
                  }}
                />
                <Button
                  label="Siguiente"
                  className="next-button"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  loading={loading}
                  onClick={() => {
                    setPasajeDataVuelta((prev) => ({
                      ...prev,
                      asientos: asientosVuelta,
                    }));
                    console.log("Antes de call");
                    setLoading(true);
                    axios
                      .post(`${URL_USUARIOSCONTROLLER}/comprarPasaje`, {
                        usuarioId: datosUsuario.id,
                        viajeId: viajeElegidoVuelta.viajeId,
                        numerosDeAsiento: asientosVuelta,
                        estadoCompra: "RESERVADA",
                      })
                      .then((res) => {
                        console.log("Compra exitosa:", res.data);
                        setCompraVuelta(res.data.idCompra);
                        console.log("aca");
                        setLoading(false);
                        stepperRef.current.nextCallback();
                      })
                      .catch((err) => {
                        //console.error(
                        //  "Error al comprar:",
                        //  err.response.data.asientosOcupados,
                        //  err.response?.data || err.message
                        //);
                        toast.current.show({
                          severity: "error",
                          summary: "Error",
                          detail:
                            "Algunos asientos elegidos ya no estan disponibles:" +
                            err.response.data.asientosOcupados,
                          life: 3000,
                        });
                      });
                  }}
                  disabled={
                    asientosVuelta.length !== asientosSeleccionados.length
                  } // Boton deshabilitado si no tiene asientos elegidos
                />
              </div>
            </StepperPanel>
          )}

          <StepperPanel header="Verificar Datos">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="card flex justify-content-center">
                  {showTimer && (
                    <Dialog
                      header="Atención"
                      visible={visible}
                      style={{ width: "50vw" }}
                      onHide={() => {
                        navigate("/");
                      }}
                      footer={footerContent}
                    >
                      <p className="m-0">
                        El tiempo de su reserva finalizo. Debe iniciar el
                        proceso nuevamente.
                      </p>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex flex-row flex-wrap gap-4-4">
              <Card title="Viaje de Ida" className="w-1/2">
                <p>
                  <strong>Fecha de Salida:</strong> {pasajeDataIda.fechaSalida}
                </p>

                <p>
                  <strong>Hora de Salida:</strong> {pasajeDataIda.horaSalida}
                </p>

                <p>
                  <strong>Fecha de Arribo:</strong> {pasajeDataIda.fechaArribo}
                </p>

                <p>
                  <strong>Hora de Arribo:</strong> {pasajeDataIda.horaArribo}
                </p>

                <p>
                  <strong>Asientos seleccionados:</strong>{" "}
                  {asientosSeleccionados.join(", ")}
                </p>
              </Card>
              <Divider />
              {esIdaVuelta ? (
                <Card title="Viaje de Vuelta" className="w-1/2">
                  <p>
                    <strong>Fecha de Salida:</strong>{" "}
                    {pasajeDataVuelta.fechaSalida}
                  </p>

                  <p>
                    <strong>Hora de Salida:</strong>{" "}
                    {pasajeDataVuelta.horaSalida}
                  </p>

                  <p>
                    <strong>Fecha de Arribo:</strong>{" "}
                    {pasajeDataVuelta.fechaArribo}
                  </p>

                  <p>
                    <strong>Hora de Arribo:</strong>{" "}
                    {pasajeDataVuelta.horaArribo}
                  </p>

                  <p>
                    <strong>Asientos seleccionados:</strong>{" "}
                    {asientosVuelta.join(", ")}
                  </p>
                </Card>
              ) : (
                ""
              )}
            </div>
            <div className="flex pt-4 justify-content-start" padding-top>
              <Button
                label="Cancelar"
                severity="secondary"
                icon="pi pi-times"
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  cancelarCompra(compraIda, compraVuelta);
                }}
              />
              <Button
                label="Pagar"
                className="next-button"
                icon="pi pi-arrow-right"
                iconPos="right"
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  let total =
                    pasajeDataIda.precio * asientosSeleccionados.length;
                  if (pasajeDataVuelta) {
                    total +=
                      pasajeDataVuelta.precio * asientosSeleccionados.length;
                  }
                  localStorage.setItem(
                    "dataIDA",
                    JSON.stringify({
                      pasajeData: pasajeDataIda,
                    })
                  );
                  localStorage.setItem("esIdayVuelta", esIdaVuelta);
                  localStorage.setItem("compraIda", compraIda);
                  localStorage.setItem("compraVuelta", compraVuelta);
                  localStorage.setItem(
                    "dataVUELTA",
                    JSON.stringify({
                      pasajeData: pasajeDataVuelta,
                    })
                  );
                  {
                    handlePagar(total);
                  }
                }}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
      <Footer />
    </>
  );
}
