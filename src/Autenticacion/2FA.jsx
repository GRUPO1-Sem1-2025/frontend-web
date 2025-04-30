import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
//PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputOtp } from 'primereact/inputotp';
//Conexion
import axios from '../Configuraciones/axios';
const URL_USUARIOSCONTROLLER = '/usuarios';

export default function TwoFA() {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: 'fedeacosta6@gmail.com',//fedeacosta6@gmail.com
        password: '123456Aa@', //Para test
        codigo: 0,
    });

    //Variables
    const { setAuth } = useAuth();
    const { auth } = useAuth();
    const [twoFA, setTwoFA] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/2FA";

    const userRef = useRef();

    //Notificaciones
    const toast = useRef(null);

    const showWarn = (message) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Error',
            detail: message,
            life: 3000
        });
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
    }

    //Effects
    //useEffect(() => {
    //    userRef.current.focus();
    //}, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${URL_USUARIOSCONTROLLER}/verificarCodigo`,
                JSON.stringify(usuario),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log(response?.data);
            //setAuth({ email: json.email, nombre: json.nombre, roles: json.roles, accessToken: token });

            setUser('');
            setPwd('');
            navigate(from, { replace: true });
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
            <Card title="Autenticación en dos factores" header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
                <Toast ref={toast} />
                <form onSubmit={handleSubmit} >
                    <label htmlFor="username">Código</label>
                    <div className="card flex justify-content-center">
                        <InputOtp value={twoFA} onChange={(e) => setTwoFA(e.value)} integerOnly style={{ justifyContent: "center", marginTop: "1rem" }}/>
                    </div>
                </form>
                <p>
                    ¿Necesitas un nuevo código? <br />
                    <span >
                        <Button style={{ marginTop: "1rem" }}>Enviar nuevo código</Button>
                    </span>
                </p>
            </Card>
        </div>
    )
}