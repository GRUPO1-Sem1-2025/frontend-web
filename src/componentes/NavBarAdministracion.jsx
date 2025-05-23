import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../Context/AuthProvider.jsx";

// PrimeReact
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';

export default function NavBarAdministracion() {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Para leer la URL actual

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/links');
    }

    const logoIzq = (
        <Link to="/links">
            <img src="/tecnobus.png" alt="Image" width="70" className="mr-2" style={{ cursor: 'pointer' }} />
        </Link>
    );

    const menuItems = [
        {
            label: 'Vendedores',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'Localidades',
                    icon: 'pi pi-map-marker',
                    url: '/links'
                },
                {
                    label: 'Asientos',
                    icon: 'pi pi-th-large',
                    url: '/links'
                },
                {
                    label: 'Ómnibus',
                    icon: 'pi pi-truck',
                    url: '/links',
                    items: [
                        {
                            label: 'Listado',
                            icon: 'pi pi-list',
                            url: '/Omnibus/AltaOmibus',
                        },
                        {
                            label: 'Cambiar estado',
                            icon: 'pi pi-refresh',
                            url: '/links',
                        }
                    ]
                },
                {
                    label: 'Viajes',
                    icon: 'pi pi-calendar',
                    items: [
                        {
                            label: 'Listado',
                            icon: 'pi pi-list',
                            url: '/Viaje/AltaViaje',
                        },
                        {
                            label: 'Cerrar venta pasajes',
                            icon: 'pi pi-lock',
                            url: '/links',
                        },
                        {
                            label: 'Devoluciones',
                            icon: 'pi pi-undo',
                            url: '/links',

                        },
                        {
                            label: 'Reasignar',
                            icon: 'pi pi-user-edit',
                            url: '/links',

                        }
                    ]
                }
            ]
        },
        {
            label: 'Administración',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Listado de...',
                    icon: 'pi pi-list',
                    url: '/links',

                },
                {
                    label: 'Estadísticas',
                    icon: 'pi pi-chart-bar',
                    url: '/links',

                },
                {
                    separator: true
                },
                {
                    label: 'Usuarios',
                    icon: 'pi pi-user',
                    url: '/links',
                    items: [
                        {
                            label: 'Listado de usuarios',
                            icon: 'pi pi-users',
                            url: '/links',

                        },
                        {
                            label: 'Alta usuario',
                            icon: 'pi pi-user-plus',
                            url: '/links',

                        },
                        {
                            label: 'Baja usuario',
                            icon: 'pi pi-user-minus',
                            url: '/links',

                        }
                    ]
                }
            ]
        },
        {
            label: 'Estadísticas',
            icon: 'pi pi-chart-line',
            url: '/links'
        },
        {
            label: 'Notificaciones',
            icon: 'pi pi-bell',
            url: '/links',

        }
    ];

    const iconoUsuario = (
        <div className="flex justify-content-end align-items-center w-full pr-3">
            <Tooltip target=".cerrar-sesion" content="Cerrar sesión" position="bottom" />
            <Avatar
                icon="pi pi-user"
                className="cerrar-sesion"
                onClick={logout}
                shape="circle"
                style={{ cursor: 'pointer' }}
            />
        </div>
    );

    return (
        <div className="card" >
            <Menubar model={menuItems} start={logoIzq} end={iconoUsuario} style={{ marginLeft: "auto" }} />
            {/* <Toolbar start={logoIzq} center={links} end={menuUsuario} style={{ paddingTop: "7px", paddingLeft: "15px", paddingRight: "15px", paddingBottom: "1px" }} /> */}
        </div>
    );
}