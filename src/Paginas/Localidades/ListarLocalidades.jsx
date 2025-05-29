import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import NavBarAdministracion from "../../Componentes/NavBarAdministracion.jsx";
import { obtenerLocalidades } from "../../Servicios/LocalidadesServicio.js";
import Noti from "../../Componentes/MsjNotificacion.jsx";
import CargaMasivaLocalidadesModal from "../../Modales/Localidades/CargaMasivaLocalidadesModal.jsx";
import AltaLocalidadModal from "../../Modales/Localidades/AltaLocalidadModal.jsx";


// PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

export default function ListarOmnibus() {
    const [localidades, setLocalidades] = useState([]);
    const toastRef = useRef();
    const [loading, setLoading] = useState(true);
    const [mostrarAlta, setMostrarAlta] = useState(false);
    const [mostrarCargaMasiva, setMostrarCargaMasiva] = useState(false);
    const [filters, setFilters] = useState({
        marca: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        matricula: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        cant_asientos: { value: null, matchMode: FilterMatchMode.EQUALS },
        activo: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const navigate = useNavigate();

    useEffect(() => {
        obtenerLocalidades().then(data => {
            setLocalidades(data);
            setLoading(false);
        });
    }, []);

    const actualizarListaOmnibus = () => {
        setLoading(true);
        obtenerLocalidades().then(data => {
            setLocalidades(data);
            setLoading(false);
        });
    };

    const mostrarActivo = (activo) => {
        return <Tag value={activo ? "Sí" : "No"} severity={activo ? "success" : "danger"} />;
    };

    const ActivoFiltro = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };

    console.log(localidades);
    return (
        <>
            <NavBarAdministracion />
            <Card style={{ marginTop: '1rem' }}>
                <Noti ref={toastRef} />
                
                <h4>Listado de localidades</h4>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>

                    <Button label="Alta localidad" icon="pi pi-plus" onClick={() => setMostrarAlta(true)} />
                    <Button label="Carga Masiva localidades" icon="pi pi-upload" severity="success" onClick={() => setMostrarCargaMasiva(true)} style={{ marginLeft: '1rem' }} />
                </div>

                <DataTable value={localidades} paginator rows={10} loading={loading}
                    rowsPerPageOptions={[10, 20, 50]} removableSort stripedRows
                    filters={filters} filterDisplay="row" emptyMessage="No se encontraron localidades.">

                    <Column field="nombre" header="Nombre" sortable filter filterPlaceholder="Buscar nombre" showFilterMenu={false} />
                    <Column field="departamento" header="Departamento" sortable filter filterPlaceholder="Buscar departamento" showFilterMenu={false} />
                    <Column field="activo" header="Activo" dataType="boolean" sortable body={(rowData) => mostrarActivo(rowData.activo)} showFilterMenu={false} filter filterElement={ActivoFiltro} />
                </DataTable>
            </Card>

            {/* Modals */}
            <AltaLocalidadModal visible={mostrarAlta} onHide={() => setMostrarAlta(false)} ref={toastRef} onSuccess={actualizarListaOmnibus} />
            <CargaMasivaLocalidadesModal visible={mostrarCargaMasiva} onHide={() => setMostrarCargaMasiva(false)} />
        </>
    );
}