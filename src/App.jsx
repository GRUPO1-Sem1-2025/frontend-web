
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import RequireAuth from './Hooks/RequireAuth.jsx';
import { ROLES } from './Configuraciones/Constantes.js';
//Paginas
import LinkPage from './Paginas/Testing/LinkPage.jsx';
import Registro from './Paginas/Usuarios/Registro.jsx';
import Login from './Paginas/Autenticacion/Login.jsx';
import Home from './Paginas/Principal/Home.jsx';
import Dashboard from './Paginas/Principal/Dashboard.jsx';
import TwoFA from './Paginas/Autenticacion/2FA.jsx';
import Layout from './Layout';
import Missing from './Paginas/Basicas/Missing.jsx';
import Unauthorized from './Paginas/Basicas/Unauthorized.jsx';
import AltaOmibus from './Paginas/Omnibus/AltaOmibus.jsx';
import ListarOmnibus from './Paginas/Omnibus/ListarOmnibus.jsx';
import AltaViaje from './Paginas/Viaje/AltaViaje.jsx';
import AltaUsuario from './Paginas/Usuarios/AltaUsuario.jsx';
import ListarUsuarios from './Paginas/Usuarios/ListarUsuarios.jsx';
import ListarLocalidades from './Paginas/Localidades/ListarLocalidades.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* ######### Rutas públicas ######### */}
                <Route path="/" element={<Home />} />
                <Route path="/registrarse" element={<Registro />} />
                <Route path="/ingresar" element={<Login />} />
                <Route path="/2FA" element={<TwoFA email='' />} />
                <Route path="/sinAutorizacion" element={<Unauthorized />} />

                {/* ######### Rutas protegidas User ######### */}
                {/*
                <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>

                </Route>
                */}

                {/* ######### Rutas protegidas Vendedor/Admin ######### */}
                {/* <Route element={<RequireAuth allowedRoles={[ROLES.Vendedor, ROLES.Admin]} />}> */}
                <Route path="/links" element={<LinkPage />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Omnibus/AltaOmibus" element={<AltaOmibus />} />
                <Route path="/Omnibus/ListarOmnibus" element={<ListarOmnibus />} />
                <Route path="/Viaje/AltaViaje" element={<AltaViaje />} />
                <Route path="/Usuarios/AltaUsuario" element={<AltaUsuario />} />
                <Route path="/Usuarios/ListarUsuarios" element={<ListarUsuarios />} />
                <Route path="/Localidades/ListarLocalidades" element={<ListarLocalidades />} />
                {/* </Route> */}

                {/* ######### Rutas protegidas Admin ######### */}
                {/*
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>

                </Route>
                */}

                {/* cualquier otra ruta no especificada*/}
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}