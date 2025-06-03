import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input2 from "../../Componentes/Input.jsx";
import { CORREO_REGEX } from '../../Configuraciones/Validaciones.js';
import Noti from '../../Componentes/MsjNotificacion.jsx';
// PrimeReact
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
// Conexión
import axios from '../../Configuraciones/axios.js';

const URL_USUARIOSCONTROLLER = '/usuarios';

const Login = () => {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        codigo: 0,
    });

    const toastRef = useRef();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL_USUARIOSCONTROLLER}/login`,
                JSON.stringify(usuario),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            navigate("/2FA", {
                replace: true,
                state: { email: usuario.email }
            });
        } catch (err) {
            let msg = '';
            if (!err?.response) {
                msg = 'No responde el servidor:\n' + err;
            } else if (err.response?.status === 400) {
                msg = err.response?.data?.mensaje || 'Usuario o contraseña incorrectos';
            } else if (err.response?.status === 401) {
                msg = err.response?.data?.mensaje || 'No autorizado';
            } else {
                msg = 'Error al ingresar';
            }
            toastRef.current?.notiError(msg);
        }
    };

    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
        }}>
            {/* Video de fondo */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    top: 0,
                    left: 0,
                    zIndex: -1
                }}
            >
                <source src="/buses2.mp4" type="video/mp4" />
                Tu navegador no soporta el video.
            </video>

            {/* Contenedor del login */}
            <div style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.93)',
                    backdropFilter: 'blur(4px)',
                    padding: '2.5rem 2rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    animation: 'fadeInUp 1s ease-out',
                    maxWidth: '500px',
                    width: '90%'
                }}>
                    {/* Logo */}
                    <img
                        src="/tecnobus.png"
                        alt="TecnoBus"
                        style={{
                            maxWidth: '150px',
                            marginBottom: '1rem',
                            borderRadius: '12px',
                            backgroundColor: 'transparent',
                            boxShadow: 'none'
                        }}
                    />

                    {/* Título */}
                    <h2 style={{
                        fontWeight: 600,
                        fontSize: '1.5rem',
                        color: '#333',
                        margin: '0 0 1.5rem 0'
                    }}>
                        Iniciar sesión
                    </h2>

                    <Noti ref={toastRef} />

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <Input2
                            titulo={"Correo"}
                            value={usuario.email}
                            regex={CORREO_REGEX}
                            onChange={(e) => setUsuario(prev => ({ ...prev, email: e.target.value }))}
                            required={true}
                        />

                        <Input2
                            type="password"
                            titulo={"Contraseña"}
                            value={usuario.password}
                            onChange={(e) => setUsuario(prev => ({ ...prev, password: e.target.value }))}
                            required={true}
                        />

                        <p>
                            <Button label="Cancelar" type="button" onClick={() => navigate('/')} severity="secondary" />
                            <Button label="Ingresar" type="submit" style={{ marginLeft: '0.5em' }} />
                        </p>
                    </form>

                    <Divider />

                    <p style={{ marginTop: '0.5em' }}>
                        ¿Necesitas una cuenta?
                        <br />
                        <Link to="/registrarse">Registrarse</Link>
                    </p>

                    <p style={{ marginTop: '0.5em' }}>
                        ¿Perdiste tu Contraseña?
                        <br />
                        <Link to="/recuperarpassword">Recuperar Contraseña</Link>
                    </p>
                </div>
            </div>

            {/* Animación */}
            <style>
                {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Login;
