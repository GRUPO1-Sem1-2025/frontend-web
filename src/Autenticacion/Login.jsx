import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
//PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const CONTROLLER_URL = '/usuarios';
import axios from '../Configuraciones/axios';

const Login = () => {
    const ROLES = {
        'User': 100,
        'Vendedor': 200,
        'Admin': 300
    };
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

    const { setAuth } = useAuth();
    const { auth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    let [email, setUser] = useState('');
    let [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    email = "test@gmail.com";
    pwd = "123456Aa@";

    useEffect(() => {
        userRef.current.focus();
    }, [])


    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const responseLogin = await axios.post(`${CONTROLLER_URL}/login`,
                JSON.stringify({ email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            const token = responseLogin?.data?.token;
            //const roles = 300;//response?.data?.rol;

            try {
                const response = await fetch(`http://localhost:8080${CONTROLLER_URL}/email/${encodeURIComponent(email)}`);
                if (response.ok) {
                    const json = await response.json();
                    //console.log("Login: ", json);

                    if (json?.roles == null) {
                        console.error("json?.roles es NULL o UNDEFINED:", auth?.roles);
                        //json.roles = 300;
                    }

                    //Guardar credenciales
                    setAuth({ email: json.email, nombre: json.nombre, roles: json.roles, accessToken: token });
                    console.log(auth);
                } else {
                    console.error('Error al obtener los usuarios');
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
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
            errRef.current.focus();
        }
    }
    const header = (
        <img
            alt="Card"
            src="/tecnobus.png"
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
    const footer = (
        <>
            <p style={{ marginBottom: '1rem' }}>
                ¿Necesitas una cuenta? <br />
                <span >
                    <Link to="/registrarse">Registrarse</Link>
                </span>
            </p>
        </>
    );
    return (
        <Card title="Ingresar" footer={footer} header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <Toast ref={toast} />
            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
            <form onSubmit={handleSubmit} style={{ marginLeft: '1rem', marginRight: '1rem' }}>
                <label htmlFor="username">Correo:</label>
                <input
                    type="text"
                    id="Correo"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={email}
                    required
                />
                <label htmlFor="password">Contraseña:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <p>
                    <Button label="Ingresar" type="submit"/>
                    <Button label="Cancel" onClick={() => navigate('/links')} severity="secondary" style={{ marginLeft: '0.5em' }} />
                </p>
            </form>
        </Card>
    )
}

export default Login