import { useState, useEffect } from "react";
import useAuth from '../../Hooks/useAuth.jsx';
import { UsuariosServicio } from "../../Servicios/UsuariosServicio.js";
import NavBarAdministracion from "../../Componentes/NavBarAdministracion.jsx";
import CargaMasivaModal from "../../Modales/Usuarios/CargaMasivaModal.jsx";
import AltaUsuarioModal from "../../Modales/Usuarios/AltaUsuarioModal.jsx";
import { ROLES_VISUAL } from '../../Configuraciones/Constantes.js';

// PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

export default function ListarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [mostrarAlta, setMostrarAlta] = useState(false);
    const [mostrarCargaMasiva, setMostrarCargaMasiva] = useState(false);

    useEffect(() => {
        if (auth?.token) {
            UsuariosServicio.listarTodos(auth.token).then(data => setUsuarios(data));
            setLoading(false);
        }
    }, [auth]);

    const actualizarListaUsuarios = () => {
        setLoading(true);
        UsuariosServicio.listarTodos(auth.token).then(data => setUsuarios(data));
        setLoading(false);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return date.toLocaleDateString("es-ES");
    };

    const formatearRol = (rol) => {
        switch (rol) {
            case 100: return "User";
            case 200: return "Vendedor";
            case 300: return "Admin";
            default: return rol;
        }
    };

    //Opciones para filtros
    const [roles] = useState(ROLES_VISUAL);

    const [filters, setFilters] = useState({
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        apellido: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        ci: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        rol: { value: null, matchMode: FilterMatchMode.EQUALS },
        categoria: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [categorias] = useState(['GENERAL', 'ESTUDIANTE', 'JUBILADO']);

    const opcionesCategorias = (options) => {
        return (
            <Dropdown value={options.value} options={categorias} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Elija uno" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    const colorFondo = (valorNumerico) => {
        switch (valorNumerico) {
            case 100: return 'info';
            case 200: return 'success';
            case 300: return 'warning';
            default: return null;
        }
    };

    const rolItemTemplate = (option) => {
        return <Tag value={option.label} severity={colorFondo(option.value)} />;
    };

    const opcionesRol = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={roles}
                onChange={(e) => options.filterApplyCallback(e.value)}
                itemTemplate={rolItemTemplate}
                placeholder="Elija uno"
                optionLabel="label"
                optionValue="value"
                className="p-column-filter"
                showClear
                style={{ minWidth: '12rem' }}
            />
        );
    };

    return (
        <>
            <NavBarAdministracion />
            <Card style={{ marginTop: '1rem' }}>
                <h4>Listado de usuarios</h4>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Button
                        label="Agregar usuario"
                        icon="pi pi-user-plus"
                        onClick={() => setMostrarAlta(true)}
                    />
                    <Button
                        label="Carga masiva"
                        icon="pi pi-file-import"
                        severity="warning"
                        onClick={() => setMostrarCargaMasiva(true)}
                    />
                </div>

                <DataTable value={usuarios} paginator rows={10} rowsPerPageOptions={[10, 25, 50]} removableSort stripedRows tableStyle={{ minWidth: '50rem' }} loading={loading}
                    emptyMessage="No se encontraro usuarios" filters={filters} filterDisplay="row" >

                    <Column sortable showFilterMenu={false} filter filterPlaceholder="Buscar..." field="nombre" header="Nombre" />
                    <Column sortable showFilterMenu={false} filter filterPlaceholder="Buscar..." field="apellido" header="Apellido" />
                    <Column sortable showFilterMenu={false} filter filterPlaceholder="Buscar..." field="email" header="Correo" />
                    <Column sortable showFilterMenu={false} filter filterPlaceholder="Buscar..." field="ci" header="Cédula" />
                    <Column sortable showFilterMenu={false} filter filterPlaceholder="Buscar..." field="rol" header="Rol" body={(rowData) => formatearRol(rowData.rol)} filterElement={opcionesRol} />
                    <Column sortable showFilterMenu={false} field="fechaNac" header="Fecha Nacimiento" body={(rowData) => formatearFecha(rowData.fechaNac)} />
                    <Column sortable showFilterMenu={false} filter filterPlaceholder="Buscar..." field="categoria" header="Categoría" filterMenuStyle={{ width: '14rem' }} filterElement={opcionesCategorias} />

                </DataTable>
            </Card>

            {/* Modals */}
            <AltaUsuarioModal visible={mostrarAlta} onHide={() => setMostrarAlta(false)} onSuccess={actualizarListaUsuarios} />
            <CargaMasivaModal visible={mostrarCargaMasiva} onHide={() => setMostrarCargaMasiva(false)} />
        </>
    );
}