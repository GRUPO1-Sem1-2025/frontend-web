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
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Stripe } from "./Stripe.jsx";
import TiempoRestante from "./TiempoRestante.jsx";
const URL_USUARIOSCONTROLLER = "/usuarios";

export default function BasicDemo() {
  const [loading, setLoading] = useState(false);
  const stepperRef = useRef(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false); // Manejo Mensaje Fin de Reserva
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [asientosVuelta, setAsientosVuelta] = useState([]);
  const [datosUsuario, setDatosUsuario] = useState([]);
  const { auth } = useContext(AuthContext);
  // Datos de la busqueda
  const location = useLocation();
  const [viajeElegido, setViajeElegido] = useState("");
  const [viajeElegidoVuelta, setViajeElegidoVuelta] = useState("");
  const [compraIda, setCompraIda] = useState("");
  const [compraVuelta, setCompraVuelta] = useState("");
  const [descuentoIda, setDescuentoIda] = useState(0);
  const [descuentoVuelta, setDescuentoVuelta] = useState(0);
  const [montoDescuentoIda, setMontoDescuentoIda] = useState(0);
  const [montoDescuentoVuelta, setMontoDescuentoVuelta] = useState(0);
  const [precioConDescuentoIda, setPrecioConDescuentoIda] = useState(0);
  const [precioConDescuentoVuelta, setPrecioConDescuentoVuelta] = useState(0);
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
      const totalRedondeado = Number(total.toFixed(2));

      const url = await Stripe(totalRedondeado);
      localStorage.setItem("pagoIniciado", "true");
      window.location.href = url; // redirige a Stripe
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      alert("Hubo un error al iniciar el pago.");
    }
  };

  useEffect(() => {
    const pagoIniciado = localStorage.getItem("pagoIniciado");
    if (pagoIniciado === "true") {
      localStorage.removeItem("pagoIniciado");
      navigate("/Venta/PagoCancelado");
    }

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

  const {
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
    categoria: "",
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
    categoria: "",
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
                  stripedRows
                  dataKey="viajeId"
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column
                    selectionMode="single"
                    headerStyle={{ width: "3rem" }}
                  ></Column>
                  <Column field="busId" header="Omnibus"></Column>
                  <Column
                    field="horaInicio"
                    header="Hora Salida"
                    body={(rowData) => rowData.horaInicio.substring(0, 5)}
                  ></Column>
                  <Column
                    field="cantAsientosDisponibles"
                    header="Asientos Disponibles"
                  ></Column>
                  <Column
                    field="horaFin"
                    header="Hora Llegada"
                    body={(rowData) => rowData.horaFin.substring(0, 5)}
                  ></Column>
                  <Column
                    field="fechaFin"
                    header="Fecha Llegada"
                    body={(rowData) => formateaFecha(rowData.fechaFin)}
                  ></Column>
                  <Column
                    field="precioPasaje"
                    header="Precio"
                    body={(rowData) => "$" + rowData.precioPasaje}
                  ></Column>
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
                  setPasajeDataIda((prev) => ({
                    ...prev,
                    nombre: datosUsuario.nombre,
                    apellido: datosUsuario.apellido,
                    ci: datosUsuario.ci,
                    categoria: datosUsuario.categoria,
                    horaArribo: viajeElegido.horaFin,
                    horaSalida: viajeElegido.horaInicio,
                    fechaArribo: formateaFecha(viajeElegido.fechaFin),
                    precio: viajeElegido.precioPasaje,
                  }));

                  stepperRef.current.nextCallback();
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
                  axios
                    .post(
                      `${URL_USUARIOSCONTROLLER}/comprarPasaje`,
                      {
                        usuarioId: datosUsuario.id,
                        viajeId: viajeElegido.viajeId,
                        numerosDeAsiento: asientosSeleccionados,
                        estadoCompra: "RESERVADA",
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${auth.token}`,
                        },
                      }
                    )
                    .then((res) => {
                      handleStart();
                      setCompraIda(res.data.idCompra);
                      setDescuentoIda(res.data.descuento);
                      const montoIda =
                        (viajeElegido.precioPasaje * res.data.descuento) / 100;
                      setMontoDescuentoIda(montoIda);
                      setPrecioConDescuentoIda(
                        viajeElegido.precioPasaje - montoIda
                      );
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
                      let detail = "";
                      if (err?.response?.status === 400) {
                        detail =
                          "Algunos asientos elegidos ya no estan disponibles:" +
                          err.response.data.asientosOcupados;
                      } else detail = err.response?.data.error;
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: detail,
                        life: 3000,
                      });
                    });
                }}
                disabled={asientosSeleccionados.length === 0}
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
                    stripedRows
                    tableStyle={{ minWidth: "50rem" }}
                  >
                    <Column
                      selectionMode="single"
                      headerStyle={{ width: "3rem" }}
                    ></Column>
                    <Column field="busId" header="Omnibus"></Column>
                    <Column
                      field="horaInicio"
                      header="Hora Salida"
                      body={(rowData) => rowData.horaInicio.substring(0, 5)}
                    ></Column>
                    <Column
                      field="cantAsientosDisponibles"
                      header="Asientos Disponibles"
                    ></Column>
                    <Column
                      field="horaFin"
                      header="Hora Llegada"
                      body={(rowData) => rowData.horaFin.substring(0, 5)}
                    ></Column>
                    <Column
                      field="fechaFin"
                      header="Fecha Llegada"
                      body={(rowData) => formateaFecha(rowData.fechaFin)}
                    ></Column>
                    <Column
                      field="precioPasaje"
                      header="Precio"
                      body={(rowData) => "$" + rowData.precioPasaje}
                    ></Column>
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
                      categoria: datosUsuario.categoria,
                      horaArribo: viajeElegidoVuelta.horaFin,
                      horaSalida: viajeElegidoVuelta.horaInicio,
                      fechaArribo: formateaFecha(viajeElegidoVuelta.fechaFin),
                      precio: viajeElegidoVuelta.precioPasaje,
                    }));
                    stepperRef.current.nextCallback();
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
                    setLoading(true);

                    axios
                      .post(
                        `${URL_USUARIOSCONTROLLER}/comprarPasaje`,
                        {
                          usuarioId: datosUsuario.id,
                          viajeId: viajeElegidoVuelta.viajeId,
                          numerosDeAsiento: asientosVuelta,
                          estadoCompra: "RESERVADA",
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${auth.token}`,
                          },
                        }
                      )
                      .then((res) => {
                        setCompraVuelta(res.data.idCompra);
                        setDescuentoVuelta(res.data.descuento);
                        const montoVuelta =
                          (viajeElegidoVuelta.precioPasaje *
                            res.data.descuento) /
                          100;
                        setMontoDescuentoVuelta(montoVuelta);

                        setPrecioConDescuentoVuelta(
                          viajeElegidoVuelta.precioPasaje - montoVuelta
                        );

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
                        let detail = "";
                        if (err?.response?.status === 400) {
                          detail =
                            "Algunos asientos elegidos ya no estan disponibles:" +
                            err.response.data.asientosOcupados;
                        } else detail = err.response?.data.error;
                        toast.current.show({
                          severity: "error",
                          summary: "Error",
                          detail: detail,
                          life: 3000,
                        });
                      });
                  }}
                  disabled={
                    asientosVuelta.length !== asientosSeleccionados.length
                  }
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
                  <strong>Hora de Salida:</strong>{" "}
                  {pasajeDataIda.horaSalida.substring(0, 5)}
                </p>

                <p>
                  <strong>Fecha de Arribo:</strong> {pasajeDataIda.fechaArribo}
                </p>

                <p>
                  <strong>Hora de Arribo:</strong>{" "}
                  {pasajeDataIda.horaArribo.substring(0, 5)}
                </p>

                <p>
                  <strong>Asientos seleccionados:</strong>{" "}
                  {asientosSeleccionados.join(", ")}
                </p>
                {datosUsuario.categoria === "GENERAL" ? (
                  <p>
                    <>
                      <strong>Precio por pasaje:</strong> {"  $"}
                      {pasajeDataIda.precio}
                      <p>
                        <strong>Total a Pagar:</strong> {"  $"}
                        {pasajeDataIda.precio * asientosSeleccionados.length}
                      </p>
                    </>
                  </p>
                ) : (
                  <>
                    <p>
                      <strong>Precio por pasaje:</strong> {"  $"}
                      {pasajeDataIda.precio}
                    </p>
                    <p>
                      <strong>Descuento Estudiante</strong> (-{descuentoIda}%)
                      <strong>:</strong>
                      {"  $"}
                      {montoDescuentoIda}
                    </p>

                    <p>
                      <strong>Precio con descuento:</strong> {"  $"}
                      {precioConDescuentoIda}
                    </p>
                    <p>
                      <strong>Total a Pagar:</strong> {"  $"}
                      {precioConDescuentoIda * asientosSeleccionados.length}
                    </p>
                  </>
                )}
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
                    {pasajeDataVuelta.horaSalida.substring(0, 5)}
                  </p>

                  <p>
                    <strong>Fecha de Arribo:</strong>{" "}
                    {pasajeDataVuelta.fechaArribo}
                  </p>

                  <p>
                    <strong>Hora de Arribo:</strong>{" "}
                    {pasajeDataVuelta.horaArribo.substring(0, 5)}
                  </p>

                  <p>
                    <strong>Asientos seleccionados:</strong>{" "}
                    {asientosVuelta.join(", ")}
                  </p>
                  {datosUsuario.categoria === "GENERAL" ? (
                    <p>
                      <>
                        <strong>Precio por pasaje:</strong> {"  $"}
                        {pasajeDataVuelta.precio}
                        <p>
                          <strong>Total a Pagar:</strong> {"  $"}
                          {pasajeDataVuelta.precio * asientosVuelta.length}
                        </p>
                      </>
                    </p>
                  ) : (
                    <>
                      <p>
                        <strong>Precio por pasaje:</strong> {"  $"}
                        {pasajeDataVuelta.precio}
                      </p>
                      <p>
                        <strong>Descuento Estudiante</strong> (-
                        {descuentoVuelta}%)
                        <strong>:</strong>
                        {"  $"}
                        {montoDescuentoVuelta}
                      </p>

                      <p>
                        <strong>Precio con descuento:</strong> {"  $"}
                        {precioConDescuentoVuelta}
                      </p>
                      <p>
                        <strong>Total a Pagar:</strong> {"  $"}
                        {precioConDescuentoVuelta * asientosVuelta.length}
                      </p>
                    </>
                  )}
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
                  let total = 0;
                  let ida, vuelta;
                  if (datosUsuario.categoria != "GENERAL") {
                    total =
                      precioConDescuentoIda * asientosSeleccionados.length;
                    ida = { ...pasajeDataIda, precio: precioConDescuentoIda };
                    if (pasajeDataVuelta) {
                      vuelta = {
                        ...pasajeDataVuelta,
                        precio: precioConDescuentoVuelta,
                      };
                      total +=
                        precioConDescuentoVuelta * asientosSeleccionados.length;
                    }
                  } else {
                    ida = pasajeDataIda;
                    vuelta = pasajeDataVuelta;
                    total = pasajeDataIda.precio * asientosSeleccionados.length;
                    if (vuelta) {
                      total +=
                        pasajeDataVuelta.precio * asientosSeleccionados.length;
                    }
                  }
                  localStorage.setItem(
                    "dataIDA",
                    JSON.stringify({
                      pasajeData: ida,
                    })
                  );
                  localStorage.setItem("esIdayVuelta", esIdaVuelta);
                  localStorage.setItem("compraIda", compraIda);
                  localStorage.setItem("compraVuelta", compraVuelta);
                  localStorage.setItem(
                    "dataVUELTA",
                    JSON.stringify({
                      pasajeData: vuelta,
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
      {/* <Footer /> */}
    </>
  );
}
