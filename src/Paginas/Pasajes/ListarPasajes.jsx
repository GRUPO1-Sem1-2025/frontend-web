import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import NavBarAdministracion from "../../Componentes/NavBarAdministracion.jsx";
import { ObtenerComprasPorViaje } from "../../Servicios/ComprasServicio.js";
import Noti from "../../Componentes/MsjNotificacion.jsx";
import useAuth from '../../Hooks/useAuth.jsx';
import { InputNumber } from 'primereact/inputnumber';

// PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from "primereact/dropdown";

export default function ListarOmnibus() {
    const toastRef = useRef();
    const [loading, setLoading] = useState(true);
    const dt = useRef(null);
    const [compras, setCompras] = useState([]);
    const { auth } = useAuth();
    const [idViaje, setIdViaje] = useState(1);
    const [mostrarFuturos, setMostrarFuturos] = useState(true);
    const [filters, setFilters] = useState({
        usuarioId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        VendedorId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        viajeId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        estadoCompra: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.token) {
            if (!idViaje) return; // seguridad básica
            ObtenerComprasPorViaje(auth?.token, idViaje).then(data => {
                setCompras(data);
                setLoading(false);

            });
        }
    }, [auth, idViaje]);

    const actualizarListaCompras = () => {
        setLoading(true);
        ObtenerComprasPorViaje(auth?.token, idViaje).then(data => {
            setCompras(data);
            setLoading(false);
        });
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const [categorias] = useState(['RESERVADO', 'CANCELADO', 'COMPRADO']);

    const opcionesCategorias = (options) => {
        return (
            <Dropdown value={options.value} options={categorias} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Elija uno" className="p-column-filter" showClear />
        );
    };

    return (
        <>
            <NavBarAdministracion />
            <Card style={{ marginTop: '1rem' }}>
                <Noti ref={toastRef} />

                <h4 style={{ marginBottom: '1rem' }}>Listado de pasajes</h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    {/* Checkbox a la izquierda */}
                    <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                        <InputNumber value={idViaje} onValueChange={(e) => setIdViaje(e.value)} min={0} placeholder="Ingrese el id del viaje" />
                        <div>
                            <Checkbox
                                inputId="futuros"
                                checked={mostrarFuturos}
                                onChange={e => setMostrarFuturos(e.checked)}

                            />
                            <label htmlFor="futuros" style={{ marginLeft: '0.5rem' }}>Ver solo actuales y futuros</label>
                        </div>
                    </div>

                    {/* Botones a la derecha */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                            label="Exportar"
                            type="button"
                            icon="pi pi-file"
                            onClick={() => exportCSV(false)}
                            data-pr-tooltip="CSV"
                            severity="secondary"
                        />
                        <Button
                            label="Vender pasaje"
                            icon="pi pi-plus"
                        //onClick={() => setMostrarAlta(true)}
                        />
                    </div>
                </div>

                <DataTable ref={dt} value={compras} paginator rows={10} loading={loading} rowsPerPageOptions={[10, 20, 50]} removableSort stripedRows
                    filters={filters} filterDisplay="row" emptyMessage="No se encontraron pasajes.">

                    <Column field="usuarioId" header="Nombre usuario" sortable filter filterPlaceholder="Buscar" showFilterMenu={false} />
                    <Column field="VendedorId" header="Nombre vendedor" sortable filter filterPlaceholder="Buscar" showFilterMenu={false} />
                    <Column field="viajeId" header="Viaje" sortable filter filterPlaceholder="Buscar" showFilterMenu={false} />
                    <Column field="estadoCompra" header="Estado" sortable filter filterPlaceholder="Buscar" showFilterMenu={false} filterElement={opcionesCategorias} />
                    <Column field="numerosDeAsiento" header="Asientos" sortable showFilterMenu={false} />
                </DataTable>
            </Card>
        </>
    );
}