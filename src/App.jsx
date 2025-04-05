
import { useState } from 'react'
import './App.css'
import Register from './Autenticacion/Register.jsx';
import Login from './Autenticacion/Login.jsx';

function App() {
  return (
    <main className="App">
      <Login />
    </main>
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