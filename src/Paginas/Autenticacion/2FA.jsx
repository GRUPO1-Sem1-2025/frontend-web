import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth.jsx';
// PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputOtp } from 'primereact/inputotp';
// Conexión
import axios from '../../Configuraciones/axios';
const URL_USUARIOSCONTROLLER = '/usuarios';

export default function TwoFA({ email }) {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        codigo: '',
    });

    const { setAuth } = useAuth();
    const { auth } = useAuth();
    const [codigo2FA, setTokens] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const toast = useRef(null);

    const showWarn = (message) => {
        toast.current.show({ severity: 'warn', summary: 'Error', detail: message, life: 3000 });
    };

    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 6000 });
    };

    useEffect(() => {
        if (location.state?.email) {
            setUsuario(prev => ({ ...prev, email: location.state.email }));
        }
    }, [location.state?.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        usuario.codigo = codigo2FA?.trim();

        if (!usuario.codigo || usuario.codigo.length !== 5) {
            showWarn('El código debe tener 5 dígitos.');
            return;
        }

        try {
            const response = await axios.post(
                `${URL_USUARIOSCONTROLLER}/verificarCodigo`,
                JSON.stringify(usuario),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log(response?.data.token);
            guardarTokenEnAuth(response?.data.token);
            navigate(from, { replace: true });
        } catch (err) {
            let msg = '';

            if (!err?.response) {
                msg = 'No responde el servidor:\n' + err;
            } else if (err.response?.status === 400) {
                msg = 'Código incorrecto';
            } else if (err.response?.status === 401) {
                msg = 'Sin autorización';
            } else {
                msg = 'Error al ingresar';
            }

            showError(msg);
        }
    };

    const guardarTokenEnAuth = (token) => {
        if (typeof token !== 'string') throw new Error("Token inválido");

        try {
            const payloadBase64 = token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            setAuth({
                token,
                nombreUsuario: payload.nombreUsuario || '',
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
            console.log("Reenviar codigo a ", usuario.email);
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

    const header = (
        <img alt="Card" src="/tecnobus.png"
            style={{
                width: '100%',
                maxWidth: '500px',
                minWidth: '400px',
                height: '250px',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '1%'
            }}
        />
    );

    return (
        <div className='rectangulo-centrado' style={{ padding: "0px" }}>
            <Card title="Autenticación de dos factores" header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
                <Toast ref={toast} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="otp">Código</label>
                    <div className="card flex justify-content-center">
                        <InputOtp
                            onChange={(e) => setTokens(e.value)}
                            value={codigo2FA}
                            length={5}
                            integerOnly
                            style={{ justifyContent: "center", marginTop: "1rem" }}
                        />
                    </div>

                    <div style={{
                        marginTop: "2rem",
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem"
                    }}>
                        <Button label="Cancelar" type="button" onClick={() => navigate('/ingresar')} severity="secondary" />
                        <Button label="Validar" type="submit" />
                    </div>
                </form>

                <p>
                    ¿Necesitas un nuevo código? <br />
                    <span>
                        <Button onClick={reenviarCodigo} style={{ marginTop: "1rem" }}>
                            Enviar nuevo código
                        </Button>
                    </span>
                </p> 
            </Card>
        </div>
    );
}
