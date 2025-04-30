
import './App.css'
import Register from './Autenticacion/Register.jsx';
import Login from './Autenticacion/Login.jsx';
import Home from './Principal/Home.jsx';
import Dashboard from './Principal/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Autenticacion/RequireAuth.jsx';
import TwoFA from './Autenticacion/2FA.jsx';
import Layout from './Layout';
import Missing from './Componentes/Missing.jsx';
import Admin from './Componentes/Admin.jsx';
import Unauthorized from './Componentes/Unauthorized.jsx';
import LinkPage from './Componentes/LinkPage.jsx';
import EditarRol from './Componentes/EditarRol.jsx';

const ROLES = { 'User': 100, 'Vendedor': 200, 'Admin': 300 }

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas publicas */}
        <Route path="/ingresar" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/links" element={<LinkPage />} />
        <Route path="sinAutorizacion" element={<Unauthorized />} />
        <Route path="/editarRoles" element={<EditarRol />} />
        <Route path="/" element={<Home />} />
        <Route path="/2FA" element={<TwoFA />} />

        {/* Rutas protegidas */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
        {/*<Route element={<RequireAuth allowedRoles={[ROLES.Vendedor, ROLES.Admin]} />}>
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