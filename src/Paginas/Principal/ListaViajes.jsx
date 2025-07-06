import { useState, useEffect } from "react";
import NavBar from "../../Componentes/NavBar.jsx";
import axios from "../../Configuraciones/axios.js";
import AuthContext from "../../Context/AuthProvider.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const URL_VIAJECONTROLLER = "/viajes";

const ListaViajes = () => {
  const [loading, setLoading] = useState(true);
  const [viajes, setViajes] = useState([]);

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

  useEffect(() => {
    axios
      .get(`${URL_VIAJECONTROLLER}/obtenerViajes`)
      .then((res) => {
        setViajes(res.data);
        setLoading(false);
      })

      .catch((err) => {
        console.error("Error al cargar viajes", err);
      });
  }, []);

  const viajesAgrupados = [];
  viajes.forEach((v) => {
    if (v.estadoViaje === "NUEVO" && compararFechas(v.fechaInicio)) {
      viajesAgrupados.push(v);
    }
  });

  return (
    <>
      <NavBar />
      <div className="flex flex-column h-12rem">
        <div className="card">
          <DataTable
            value={viajesAgrupados}
            header={<h3 style={{ textAlign: "center" }}>Viajes Disponibles</h3>}
            loading={loading}
            stripedRows
            paginator
            rows={10}
            selectionMode="button"
            dataKey="id"
            tableStyle={{ minWidth: "50rem" }}
            filterDisplay="row"
            globalFilterFields={[
              "fechaInicio",
              "idLocalidadOrigen",
              "idLocalidadDestino",
            ]}
            emptyMessage="No hay viajes disponibles"
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
              header="Precio"
              body={(rowData) => "$" + rowData.precio}
              sortable
              filter
              filterPlaceholder="Precio"
              filterMatchMode="startsWith"
              showFilterMenu={false}
            ></Column>
            <Column
              field="asientosLibres"
              header="Asientos Disponibles"
            ></Column>
          </DataTable>
        </div>
      </div>
      <div className="card flex justify-content-center"></div>
    </>
  );
};

export default ListaViajes;
