import { useState, useContext, useEffect, useRef } from "react";
import NavBar from "../../Componentes/NavBar.jsx";
import axios from "../../Configuraciones/axios.js";
import AuthContext from "../../Context/AuthProvider.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Calificar from "./CalificarViaje.jsx";
import imprimirPasaje from "../Ventas/printPasaje.jsx";
import { Stripe } from "../Ventas/Stripe.jsx";

const URL_USUARIOSCONTROLLER = "/usuarios";
const URL_VIAJECONTROLLER = "/viajes";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [viajes, setViajes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [viaje, setViaje] = useState("");
  const [datosUsuario, setDatosUsuario] = useState([]);
  const calledRef = useRef(false);
  const toast = useRef(null);

  const formateaFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    const dia = +day;
    const fechaFormateada = `${dia}/${month}/${year}`;
    return fechaFormateada;
  };

  const compararFechas = (fechaAComparar) => {
    const fechaViaje = new Date(fechaAComparar);
    const hoy = new Date();

    // Eliminar la parte de hora para comparar solo por fecha:
    fechaViaje.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    if (fechaViaje > hoy) {
      return true;
    } else {
      return false;
    }
  };

  const mostrarToast = (mensaje, tipo, summary) => {
    toast.current.show({
      severity: tipo,
      summary: summary,
      detail: mensaje,
      life: 3000,
    });
  };

  const handlePagar = async (total) => {
    try {
      const totalRedondeado = Number(total.toFixed(2));

      const url = await Stripe(totalRedondeado);
      localStorage.setItem("pagoIniciado", "true");
      window.location.href = url;
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      alert("Hubo un error al iniciar el pago.");
    }
  };

  const cancelarReserva = async (viaje) => {
    try {
      await axios.post(`${URL_USUARIOSCONTROLLER}/cancelarCompra`, null, {
        params: {
          idCompra: viaje,
        },
      });
      mostrarToast("Se cancelo la reserva: ", "success", "Exito");
      await cargarReservas(datosUsuario.id);
    } catch (error) {
      mostrarToast("Hubo un problema cancelando la reserva", "error", "Error");
      console.error("Error cancelando ida:", error);
    }
  };

  const handleCancelar = async (viaje) => {
    confirmDialog({
      message: "Quiere cancelar la reserva?",
      header: "Atención",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => cancelarReserva(viaje),
    });
  };

  const cargarViajes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${URL_USUARIOSCONTROLLER}/ObtenerMisCompras`,
        null,
        {
          params: {
            email: auth.email,
          },
        }
      );
      const viajesUsuario = response.data;
      const viajes = await Promise.all(
        viajesUsuario.map(async (viajesUsuario, index) => {
          const datosViaje = await axios.get(
            `${URL_VIAJECONTROLLER}/obtenerViajeId`,
            {
              params: {
                idViaje: viajesUsuario.viajeId,
              },
            }
          );
          return {
            indice: index + 1,
            ...viajesUsuario,
            ...datosViaje.data,
          };
        })
      );
      setViajes(viajes);
    } catch (err) {
      setError("Error al cargar datos del usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarReservas = async (idUser) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${URL_USUARIOSCONTROLLER}/ObtenerMisReservas`,
        null,
        {
          params: {
            email: auth.email,
          },
        }
      );
      const reservasUsuario = response.data;
      const reservas = await Promise.all(
        reservasUsuario.map(async (reservasUsuario, index) => {
          const datosViaje = await axios.get(
            `${URL_VIAJECONTROLLER}/obtenerCompraViaje`,
            {
              params: {
                idViaje: reservasUsuario.viajeId,
                idCompra: reservasUsuario.compraId,
                idUsuario: idUser,
              },
            }
          );
          return {
            indice: index + 1,
            ...reservasUsuario,
            ...datosViaje.data,
          };
        })
      );
      setReservas(reservas);
    } catch (err) {
      setError("Error al cargar datos del usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (calledRef.current) return; // ya se llamó, salimos
    calledRef.current = true;

    const cargarDatos = async () => {
      try {
        const response = await axios.get(`${URL_USUARIOSCONTROLLER}/emails/`, {
          params: {
            email: auth.email,
          },
        });
        const user = response.data.OK;
        setDatosUsuario(user);
        await cargarViajes();
        await cargarReservas(user.id);
      } catch (err) {
        setError("Error al cargar datos del usuario");
        console.error(err);
      }
    };

    cargarDatos();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <NavBar />
      <div className="flex flex-column h-12rem">
        <div className="card">
          <DataTable
            value={reservas}
            header={<h3 style={{ textAlign: "center" }}>Mis Reservas</h3>}
            loading={loading}
            paginator
            rows={5}
            selectionMode="button"
            dataKey="indice"
            tableStyle={{ minWidth: "50rem" }}
            filterDisplay="row"
            globalFilterFields={[
              "fechaInicio",
              "idLocalidadOrigen",
              "idLocalidadDestino",
            ]}
            emptyMessage="No tienes reservas actualmente"
          >
            <Column
              field="fechaInicio"
              header="Fecha de Salida"
              body={(rowData) => formateaFecha(rowData.fechaInicio)}
              sortable
              filter
              filterPlaceholder="Fecha salida"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="horaInicio"
              body={(rowData) => rowData.horaInicio.substring(0, 5)}
              header="Hora Salida"
              sortable
              filter
              filterPlaceholder="Hora salida"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="fechaFin"
              header="Fecha Llegada"
              body={(rowData) => formateaFecha(rowData.fechaFin)}
              sortable
              filter
              filterPlaceholder="Fecha Llegada"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="horaFin"
              body={(rowData) => rowData.horaFin.substring(0, 5)}
              header="Hora Llegada"
              sortable
              filter
              filterPlaceholder="Hora Llegada"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              className="gap-x-5"
              field="localidadOrigenLocalidad"
              header="Origen"
              sortable
              filter
              filterPlaceholder="Localidad Origen"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="localidadDestinoLocalidad"
              header="Destino"
              sortable
              filter
              filterPlaceholder="Localidad Destino"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="precio"
              body={(rowData) => "$" + rowData.precio}
              header="Total a pagar"
              sortable
              filter
              filterPlaceholder="Monto"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              body={(rowData) => rowData.numerosDeAsiento?.join(", ")}
              header="Asientos"
            ></Column>

            <Column
              headerStyle={{ width: "3rem" }}
              body={(rowData) => (
                <Button
                  className="descargar-button"
                  icon="pi pi-dollar"
                  rounded
                  severity="success"
                  tooltip="Pagar"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => {
                    localStorage.setItem(
                      "dataIDA",
                      JSON.stringify({
                        pasajeData: {
                          nombre: datosUsuario.nombre,
                          apellido: datosUsuario.apellido,
                          ci: datosUsuario.ci,
                          destino: rowData.localidadDestinoLocalidad,
                          origen: rowData.localidadOrigenLocalidad,
                          asientos: rowData.numerosDeAsiento,
                          precio: rowData.precio / rowData.cantidadAsientos,
                          fechaSalida: formateaFecha(rowData.fechaInicio),
                          horaSalida: rowData.horaInicio,
                          fechaArribo: formateaFecha(rowData.fechaFin),
                          horaArribo: rowData.horaFin,
                          via: "web",
                        },
                      })
                    );
                    localStorage.setItem("esIdayVuelta", false);
                    localStorage.setItem("compraIda", rowData.compraId);
                    handlePagar(rowData.precio);
                  }}
                />
              )}
            ></Column>

            <Column
              headerStyle={{ width: "3rem" }}
              body={(rowData) => (
                <Button
                  className="cancelar-button"
                  icon="pi pi-times"
                  rounded
                  severity="danger"
                  tooltip="Cancelar Reserva"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => {
                    handleCancelar(rowData.compraId);
                  }}
                />
              )}
            ></Column>
          </DataTable>
        </div>
      </div>

      <div className="flex flex-column h-12rem">
        <div className="card">
          <DataTable
            value={viajes}
            header={<h3 style={{ textAlign: "center" }}>Mis Viajes</h3>}
            loading={loading}
            paginator
            rows={5}
            selectionMode="button"
            dataKey="indice"
            tableStyle={{ minWidth: "50rem" }}
            filterDisplay="row"
            globalFilterFields={[
              "fechaInicio",
              "idLocalidadOrigen",
              "idLocalidadDestino",
            ]}
            emptyMessage="Aún no tienes viajes"
          >
            <Column
              field="fechaInicio"
              header="Fecha de Salida"
              body={(rowData) => formateaFecha(rowData.fechaInicio)}
              sortable
              filter
              filterPlaceholder="Fecha salida"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="horaInicio"
              body={(rowData) => rowData.horaInicio.substring(0, 5)}
              header="Hora Salida"
              sortable
              filter
              filterPlaceholder="Hora salida"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="fechaFin"
              header="Fecha Llegada"
              body={(rowData) => formateaFecha(rowData.fechaFin)}
              sortable
              filter
              filterPlaceholder="Fecha Llegada"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="horaFin"
              body={(rowData) => rowData.horaFin.substring(0, 5)}
              header="Hora Llegada"
              sortable
              filter
              filterPlaceholder="Hora Llegada"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              className="gap-x-5"
              field="idLocalidadOrigen"
              header="Origen"
              sortable
              filter
              filterPlaceholder="Localidad Origen"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="idLocalidadDestino"
              header="Destino"
              sortable
              filter
              filterPlaceholder="Localidad Destino"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="precio"
              body={(rowData) => "$" + rowData.precio}
              header="Precio"
              sortable
              filter
              filterPlaceholder="Precio"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              body={(rowData) => rowData.numerosDeAsiento?.join(", ")}
              header="Asientos"
            ></Column>

            <Column
              headerStyle={{ width: "3rem" }}
              body={(rowData) => (
                <Button
                  icon="pi pi-star"
                  rounded
                  aria-label="Bookmark"
                  tooltip="Calificar viaje"
                  tooltipOptions={{ position: "top" }}
                  disabled={compararFechas(rowData.fechaFin)}
                  onClick={() => {
                    setViaje(rowData.viajeId);
                    setVisible(true);
                  }}
                />
              )}
            ></Column>

            <Column
              headerStyle={{ width: "3rem" }}
              body={(rowData) => (
                <Button
                  className="descargar-button"
                  icon="pi pi-download"
                  rounded
                  outlined
                  aria-label="Bookmark"
                  tooltip="Descargar pasaje"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => {
                    const data = {
                      nombre: datosUsuario.nombre,
                      apellido: datosUsuario.apellido,
                      ci: datosUsuario.ci,
                      destino: rowData.idLocalidadDestino,
                      origen: rowData.idLocalidadOrigen,
                      asientos: rowData.numerosDeAsiento,
                      precio: rowData.precio,
                      fechaSalida: formateaFecha(rowData.fechaInicio),
                      horaSalida: rowData.horaInicio,
                      fechaArribo: formateaFecha(rowData.fechaFin),
                      horaArribo: rowData.horaFin,
                      via: "Web",
                      categoria: datosUsuario.categoria,
                    };
                    imprimirPasaje(data);
                  }}
                />
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
      <div className="card flex justify-content-center">
        <Button
          label="Show"
          icon="pi pi-external-link"
          onClick={() => setVisible(true)}
        />
        <Dialog
          header="Calificar Viaje"
          visible={visible}
          style={{ width: "30vw" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <Calificar
            viaje={viaje}
            usuario={datosUsuario.id}
            cerrar={() => setVisible(false)}
            onMostrarToast={mostrarToast}
          />
        </Dialog>
      </div>
    </>
  );
};
export default Home;
