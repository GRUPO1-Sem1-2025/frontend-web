import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth.jsx';
//PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
//Conexion
import axios from '../../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

const Login = () => {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: 'fedeacosta6@gmail.com',//fedeacosta6@gmail.com
        password: '123456Aa@', //Para test
        codigo: 0,
    });

    //Variables
    const { auth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    //const from = location.state?.from?.pathname || "/2FA";

    const userRef = useRef();

    //Notificaciones
    const toast = useRef(null);

    const showWarn = (message) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Error',
            detail: message,
            life: 6000
        });
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 6000 });
    }

    //Effects
    useEffect(() => {
        userRef.current.focus();
    }, [])

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

            navigate("/2FA", {
                replace: true,
                state: { email: usuario.email }
            });
            //navigate(from, { replace: true });
        } catch (err) {
            let msg = '';

            if (!err?.response) {
                msg = 'No responde el servidor:\n' + err;
            } else if (err.response?.status === 400) {
                msg = 'Usuario o contraseña incorrectos';
            } else if (err.response?.status === 401) {
                msg = 'Sin autorización';
            } else {
                msg = 'Error al ingresar';
            }

            showWarn(msg);
            //errRef.current.focus();
        }
    }

    //Variables componentes
    const header = (
        <img alt="Card" src="/tecnobus.png"
            style={{
                width: '100%',
                maxWidth: '500px',
                minWidth: '400px',
                height: '250px',         // Altura fija para forma rectangular
                objectFit: 'cover',      // Rellena y recorta lo que sobra
                display: 'block',
                borderRadius: '1%'
            }}
        />
    );

    return (
        <div className='rectangulo-centrado' style={{ padding: "0px" }}>
            <Card title="Iniciar sesión" header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
                <Toast ref={toast} />
                <form onSubmit={handleSubmit} >
                    <label htmlFor="username">Correo</label>
                    <input
                        type="text"
                        id="Correo"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={usuario.email}
                        required
                    />

                    <label htmlFor="password" style={{ marginTop: "10px" }}>Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={usuario.password}
                        required
                    />
                    <p style={{ marginTop: "0.2em" }}>
                        <Button label="Cancel" onClick={() => navigate('/links')} severity="secondary" />
                        <Button label="Ingresar" type="submit" style={{ marginLeft: '0.5em' }} />
                    </p>
                </form>
                <p>
                    ¿Necesitas una cuenta? <br />
                    <span >
                        <Link to="/registrarse">Registrarse</Link>
                    </span>
                </p>
            </Card>
        </div>
    )
}

export default Login