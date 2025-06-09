import React, { useState, useEffect } from 'react';
import NavBar from '../../Componentes/NavBar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import axios from 'axios';

const logoSrc = "/tecnobus.png"; // Cambiá esto si querés usar otra imagen, como "/perfil.png"

const Perfil = () => {
    const [usuario, setUsuario] = useState({
        id: null,
        nombre: '',
        apellido: '',
        email: '',
        cedula: '',
        fechaNacimiento: '',
    });

    const [editando, setEditando] = useState({
        nombre: false,
        apellido: false,
        email: false,
        cedula: false,
        fechaNacimiento: false,
    });

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const storedAuth = localStorage.getItem('auth');
                if (!storedAuth) return;

                const { email } = JSON.parse(storedAuth);

                const response = await axios.get(`https://backend.tecnobus.uy/usuarios/emails/?email=${email}`);
                const data = response.data;

                setUsuario({
                    id: data.id || null,
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    email: data.email || '',
                    cedula: data.ci || '',
                    fechaNacimiento: data.fechaNac || '',
                });

                console.log("ID del usuario cargado:", data.id);

            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        };

        cargarUsuario();
    }, []);

    const handleInputChange = (e, campo) => {
        const val = e.target.value;
        setUsuario(prev => ({ ...prev, [campo]: val }));
    };

    const toggleEdit = (campo) => {
        setEditando(prev => ({ ...prev, [campo]: !prev[campo] }));
    };

    const handleGuardar = async () => {
        try {
            const payload = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
            };

            const response = await axios.post('https://backend.tecnobus.uy/usuarios/modificarPerfil', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Perfil actualizado:", response.data);
            alert("Perfil actualizado correctamente.");
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Hubo un error al actualizar el perfil.");
        }
    };

    const handleDesactivarCuenta = async () => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas desactivar tu cuenta? Esta acción no se puede deshacer.");

        if (!confirmacion) return;

        try {
            const formData = new FormData();
            formData.append('email', usuario.email);

            const response = await axios.post(
                'https://backend.tecnobus.uy/usuarios/borrarUsuario',
                formData
            );

            console.log("Cuenta desactivada:", response.data);
            alert("Tu cuenta ha sido desactivada.");

            localStorage.removeItem("auth");
            window.location.href = "/";
        } catch (error) {
            console.error("Error al desactivar la cuenta:", error);
            alert("No se pudo desactivar la cuenta.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="rectangulo-centrado">
                <Card className="cardCentrada" style={{ backgroundColor: '#c9f0ff' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                border: '4px solid white',
                                backgroundColor: '#fff'
                            }}
                        >
                            <img
                                src={logoSrc}
                                alt="Logo Tecnobus"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
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
                        <span
                            onClick={handleDesactivarCuenta}
                            style={{
                                color: 'darkred',
                                textDecoration: 'underline',
                                display: 'inline-block',
                                marginBottom: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Desactivar mi cuenta
                        </span>
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
