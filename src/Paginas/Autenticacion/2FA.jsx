import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth.jsx';
//PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputOtp } from 'primereact/inputotp';
//Conexion
import axios from '../../Configuraciones/axios';
const URL_USUARIOSCONTROLLER = '/usuarios';

export default function TwoFA({ email }) {
    console.log(email);
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        codigo: '',
    });

    //Variables
    const { setAuth } = useAuth();
    const { auth } = useAuth();
    const [codigo2FA, setTokens] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

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

    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 6000 });
    }

    //Effects
    useEffect(() => {
        if (location.state?.email) {
            setUsuario(prev => ({ ...prev, email: location.state.email }));
        }
    }, [location.state?.email]);

    // useEffect(() => {
    //     if (!usuario.email) {
    //       navigate("/ingresar");
    //     }
    //   }, [usuario.email]);

    //useEffect(() => {
    //    userRef.current.focus();
    //}, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(usuario);
        usuario.codigo = codigo2FA.trim();

        if (usuario.codigo.length !== 5) {
            showWarn('El código debe tener 5 dígitos.');
            return;
        }

        try {
            const response = await axios.post(`${URL_USUARIOSCONTROLLER}/verificarCodigo`,
                JSON.stringify(usuario),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log(response?.data.token);//para pruebas
            guardarTokenEnAuth(response?.data.token);
            navigate(from, { replace: true });
        } catch (err) {
            let msg = '';

            if (!err?.response) {
                msg = 'No responde el servidor:\n' + err;
            } else if (err.response?.status === 400) {
                msg = 'Codigo incorrecto';
            } else if (err.response?.status === 401) {
                msg = 'Sin autorización';
            } else {
                msg = 'Error al ingresar';
            }

            showError(msg);
            //errRef.current.focus();
        }
    }

    const guardarTokenEnAuth = (token) => {
        if (typeof token !== 'string') throw new Error("Token inválido");
        
        try {
            const payloadBase64 = token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            setAuth({
                token,
                email: payload.sub || '',
                rol: payload.rol || '',
                emision: new Date(payload.iat * 1000),
                expira: new Date(payload.exp * 1000),
            });
            console.log("Variable sesión guardada", auth);

        } catch (error) {
            console.error('Token inválido:', error);
        }
    };

    const reenviarCodigo = async () => {
        try {
            const response = await axios.post(
                `${URL_USUARIOSCONTROLLER}/reenviarCodigo?email=${encodeURIComponent(usuario.email)}`
            );

            toast.current.show({
                severity: 'success',
                summary: 'Código reenviado',
                detail: 'Revisa tu correo electrónico',
                life: 5000
            });

            console.log(response.data);
        } catch (err) {
            console.error(err);
            showError('No se pudo reenviar el código');
        }
    };

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
            <Card title="Autenticación de dos factores" header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
                <Toast ref={toast} />
                <form onSubmit={handleSubmit} >
                    <label htmlFor="username">Código</label>
                    <div className="card flex justify-content-center">
                        <InputOtp
                            onChange={(e) => setTokens(e.value)}
                            value={codigo2FA}
                            length={5}
                            integerOnly style={{ justifyContent: "center", marginTop: "1rem" }} />
                    </div>
                    <p style={{ marginTop: "0.2em" }}>
                        <Button label="Cancel" onClick={() => navigate('/ingresar')} severity="secondary" />
                        <Button label="Validar" type="submit" style={{ marginLeft: '0.5em' }} />
                    </p>
                </form>
                <p>
                    ¿Necesitas un nuevo código? <br />
                    <span >
                        <Button onClick={reenviarCodigo} style={{ marginTop: "1rem" }}>Enviar nuevo código</Button>
                    </span>
                </p>
            </Card>
        </div>
    )
}