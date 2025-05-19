
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import RequireAuth from './Hooks/RequireAuth.jsx';

//Paginas
import LinkPage from './Paginas/Testing/LinkPage.jsx';
import Register from './Paginas/Autenticacion/Register.jsx';
import Login from './Paginas/Autenticacion/Login.jsx';
import Home from './Paginas/Principal/Home.jsx';
import Dashboard from './Paginas/Principal/Dashboard.jsx';
import TwoFA from './Paginas/Autenticacion/2FA.jsx';
import Layout from './Layout';
import Missing from './Paginas/Basicas/Missing.jsx';
import Unauthorized from './Paginas/Basicas/Unauthorized.jsx';
import AltaOmibus from './Paginas/Omnibus/AltaOmibus.jsx';
import ListadoOmnibus from './Paginas/Omnibus/ListadoOmnibus.jsx';
import AltaViaje from './Paginas/Viaje/AltaViaje.jsx';

const ROLES = { 'User': 100, 'Vendedor': 200, 'Admin': 300 }

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas publicas */}
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/2FA" element={<TwoFA email='' />} />

        <Route path="/sinAutorizacion" element={<Unauthorized />} />

        {/* Rutas protegidas */}
        <Route path="/links" element={<LinkPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Omnibus/AltaOmibus" element={<AltaOmibus />} />
        <Route path="/Omnibus/ListadoOmnibus" element={<ListadoOmnibus />} />
        <Route path="/Viaje/AltaViaje" element={<AltaViaje />} />

        {/*
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Vendedor, ROLES.Admin]} />}>
          <Route path="principal" element={<Lounge />} />
        </Route> */}

        {/* cualquier otra ruta no especificada*/}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App

import './App.css'

/*
import { API_URL } from "./Configuraciones/Constantes.ts";

import React, { useEffect, useState } from 'react';
//const API_URL = 'http://localhost:8080/usuarios'; // URL de la API
const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función que hace la llamada a la API
    const obtenerUsuarios = async () => {
      try {
        console.info(`URL: ${API_URL}`);

        // Realizamos la llamada GET
        const response = await fetch(`http://localhost:8080/usuarios`);
        
        // Verificamos que la respuesta es exitosa (código 200)
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);  // Guardamos los usuarios en el estado
          console.log('Número de usuarios:', data.length);  // Mostramos la cantidad de usuarios en consola
        } else {
          console.error('Error al obtener los usuarios');
        }
      } catch (error) {
        console.error('Error al hacer la solicitud:', error);
      } finally {
        setLoading(false);  // Terminamos el proceso de carga
      }
    };

    obtenerUsuarios();  // Llamada a la API cuando el componente se monta
  }, []); // Dependencia vacía para que solo se ejecute una vez al montar el componente

  return (
    <div>
      <h1>Usuarios</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          <p>Total de usuarios: {usuarios.length}</p>
          <ul>
            {usuarios.map((usuario, index) => (
              <li key={index}>{usuario.nombre}</li>  // Asumiendo que 'nombre' es un campo en los usuarios
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;

*/