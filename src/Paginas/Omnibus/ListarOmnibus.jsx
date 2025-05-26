import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import NavBarAdministracion from "../../Componentes/NavBarAdministracion.jsx";
import { obtenerOmnibus } from "../../Servicios/OmnibusServicio.js";
import Noti from "../../Componentes/MsjNotificacion.jsx";
import CargaMasivaAsientosModal from "../../Modales/Asientos/CargaMasivaAsientosModal.jsx";
import AltaOmnibusModal from "../../Modales/Omnibus/AltaOmnibusModal.jsx";


// PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

export default function ListarOmnibus() {
    const [omnibus, setOmnibus] = useState([]);
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
        obtenerOmnibus().then(data => {
            setOmnibus(data);
            setLoading(false);
        });
    }, []);

    const mostrarActivo = (activo) => {
        return <Tag value={activo ? "Sí" : "No"} severity={activo ? "success" : "danger"} />;
    };

    const ActivoFiltro = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };

    console.log(omnibus);
    return (
        <>
            <NavBarAdministracion />
            <Card style={{ marginTop: '1rem' }}>
                <Noti ref={toastRef} />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Button label="Alta Ómnibus" icon="pi pi-plus" onClick={() => setMostrarAlta(true)} />
                    <Button label="Carga Masiva Asientos" icon="pi pi-upload" severity="success" onClick={() => setMostrarCargaMasiva(true)} style={{ marginLeft: '1rem' }} />
                </div>

                <DataTable value={omnibus} paginator rows={10} loading={loading}
                    rowsPerPageOptions={[10, 20, 50]} removableSort stripedRows
                    filters={filters} filterDisplay="row" emptyMessage="No se encontraron ómnibus.">

                    <Column field="marca" header="Marca" sortable filter filterPlaceholder="Buscar marca" showFilterMenu={false} />
                    <Column field="matricula" header="Matrícula" sortable filter filterPlaceholder="Buscar matrícula" showFilterMenu={false} />
                    <Column field="cant_asientos" header="Asientos" sortable filter filterPlaceholder="Ej: 40" showFilterMenu={false} />
                    <Column field="activo" header="Activo" dataType="boolean" sortable body={(rowData) => mostrarActivo(rowData.activo)} showFilterMenu={false} filter filterElement={ActivoFiltro} />
                </DataTable>
            </Card>

            {/* Modals */}
            <AltaOmnibusModal visible={mostrarAlta} onHide={() => setMostrarAlta(false)} ref={toastRef} />
            <CargaMasivaAsientosModal visible={mostrarCargaMasiva} onHide={() => setMostrarCargaMasiva(false)} />
        </>
    );
}