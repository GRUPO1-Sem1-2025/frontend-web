import React, { useState } from 'react';
import NavBar from '../../Componentes/NavBar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

// Asegurate de que la imagen esté en public o importada
// Si está en public, usá esta ruta:
const logoSrc = "/tecnobus.png"; // desde /public

const Perfil = () => {
    const [usuario, setUsuario] = useState({
        nombre: 'Pablo',
        apellido: 'Sanchez',
        email: 'pablofing2013@gmail.com',
        cedula: 'CI',
        fechaNacimiento: 'Fecha',
    });

    const [editando, setEditando] = useState({
        nombre: false,
        apellido: false,
        email: false,
        cedula: false,
        fechaNacimiento: false,
    });

    const handleInputChange = (e, campo) => {
        const val = e.target.value;
        setUsuario(prev => ({ ...prev, [campo]: val }));
    };

    const toggleEdit = (campo) => {
        setEditando(prev => ({ ...prev, [campo]: !prev[campo] }));
    };

    const handleGuardar = () => {
        console.log('Datos guardados:', usuario);
    };

    return (
        <>
            <NavBar />
            <div className="rectangulo-centrado">
                <Card className="cardCentrada" style={{ backgroundColor: '#c9f0ff' }}>
                    
                    {/* Imagen del logo */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <img
                            src={logoSrc}
                            alt="Logo Tecnobus"
                            style={{
                                width: '120px',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    </div>

                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Mi Perfil</h2>

                    {['nombre', 'apellido', 'email', 'cedula', 'fechaNacimiento'].map(campo => (
                        <div key={campo} style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor={campo} style={{ fontWeight: 'bold', display: 'block', marginBottom: '.5rem' }}>
                                {campo === 'fechaNacimiento' ? 'Fecha de nacimiento' : campo.charAt(0).toUpperCase() + campo.slice(1)}
                            </label>
                            <span className="p-input-icon-right" style={{ width: '100%' }}>
                                <InputText
                                    id={campo}
                                    value={usuario[campo]}
                                    onChange={(e) => handleInputChange(e, campo)}
                                    disabled={!editando[campo]}
                                    style={{ width: '100%' }}
                                />
                                <i
                                    className="pi pi-pencil"
                                    onClick={() => toggleEdit(campo)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                />
                            </span>
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <a href="#" style={{ color: 'darkred', textDecoration: 'underline', display: 'inline-block', marginBottom: '1rem' }}>
                            Desactivar mi cuenta
                        </a>
                        <br />
                        <Button
                            label="Guardar"
                            onClick={handleGuardar}
                            className="p-button-secondary"
                            style={{ marginTop: '1rem', width: '60%' }}
                        />
                        <div style={{ marginTop: '1rem' }}>
                            <Link to="/recuperarpassword" style={{ color: '#007bff', textDecoration: 'underline' }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Perfil;
