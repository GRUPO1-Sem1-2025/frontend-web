import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import RequireAuth from "./Hooks/RequireAuth.jsx";
import { ROLES } from './Configuraciones/Constantes.js';


//Paginas
import LinkPage from "./Paginas/Testing/LinkPage.jsx";
import Registro from "./Paginas/Usuarios/Registro.jsx";
import Login from "./Paginas/Autenticacion/Login.jsx";
import Home from "./Paginas/Principal/Home.jsx";
import TwoFA from "./Paginas/Autenticacion/2FA.jsx";
import Layout from "./Layout";
import Missing from "./Paginas/Basicas/Missing.jsx";
import Unauthorized from "./Paginas/Basicas/Unauthorized.jsx";
import Venta from "./Paginas/Ventas/VentaPasaje.jsx";
import CompraExitosa from "./Paginas/Ventas/CompraExitosa.jsx";
import Stripe from "./Paginas/Ventas/Stripe.jsx";
import RecuperarPassword from "./Paginas/Usuarios/RecuperarPassword.jsx";
import CambiarPassword from "./Componentes/CambiarPassword.jsx";

//const ROLES = { User: 100, Vendedor: 200, Admin: 300 };



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas publicas */}
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<Registro />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/2FA" element={<TwoFA email="" />} />
        <Route path="/sinAutorizacion" element={<Unauthorized />} />
        <Route path="/recuperarpassword" element={<RecuperarPassword />} />
        <Route path="/CambiarPassword" element={<CambiarPassword />} />

        {/* RUTA PROTEGIDA PARA USUARIOS REGISTRADOS*/}
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}> */}

        {/* OTRAS RUTAS */}
        <Route path="/Venta/VentaPasaje" element={<Venta />} />
        <Route path="/links" element={<LinkPage />} />
        <Route path="/Venta/CompraExitosa" element={<CompraExitosa />} />
        <Route path="/Venta/Stripe" element={<Stripe />} />

        {/* cualquier otra ruta no especificada*/}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
