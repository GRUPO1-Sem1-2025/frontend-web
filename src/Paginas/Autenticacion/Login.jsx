import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input2 from "../../Componentes/Input.jsx";
import { CORREO_REGEX } from '../../Configuraciones/Validaciones.js';
import Noti from '../../Componentes/MsjNotificacion.jsx';
// PrimeReact
import { Card } from 'primereact/card';
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
    const [loading, setLoading] = useState(false);

    //Variables componentes
    const header = (
        <img alt="Card" src="/tecnobus.png"
            style={{
                width: '100%',
                maxWidth: '500px',
                minWidth: '300px',
                height: '250px',         // Altura fija para forma rectangular
                objectFit: 'cover',      // Rellena y recorta lo que sobra
                display: 'block',
                borderRadius: '1%'
            }}
        />
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL_USUARIOSCONTROLLER}/login`,
                JSON.stringify(usuario),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(response?.data);




           if (response?.data.Login_directo == 0) {
                navigate("/CambiarPassword", {
                    replace: true,
                    state: { email: usuario.email }
                });
            } else {
                navigate("/2FA", {
                    replace: true,
                    state: { email: usuario.email }
                });
            }
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
        setLoading(false);
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

        {/* Contenedor del login centrado */}
        <div style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Card 
                title="Iniciar sesión"
                header={header}
                style={{
                    maxWidth: '420px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.93)',
                    backdropFilter: 'blur(4px)',
                    padding: '2.5rem 2rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    animation: 'fadeInUp 1s ease-out',
                    width: '90%'
                }}
            >
                <Noti ref={toastRef} />

                <form onSubmit={handleSubmit}>
                    <Input2
                        titulo={"Correo"}
                        value={usuario.email}
                        regex={CORREO_REGEX}
                        onChange={(e) => {
                            const val = e.target.value;
                            setUsuario(prev => ({ ...prev, email: val }));
                        }}
                        required={true}
                    />

                    <Input2
                        type="password"
                        titulo={"Contraseña"}
                        value={usuario.password}
                        onChange={(e) => {
                            const val = e.target.value;
                            setUsuario(prev => ({ ...prev, password: val }));
                        }}
                        required={true}
                    />

                    <p>
                        <Button label="Cancelar" type="button" onClick={() => navigate('/links')} severity="secondary" />
                        <Button label="Ingresar" type="submit" loading={loading} style={{ marginLeft: '0.5em' }} />
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
            </Card>
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
