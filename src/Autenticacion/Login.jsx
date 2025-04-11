import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

import axios from '../Configuraciones/axios';
const CONTROLLER_URL = '/usuarios';

const Login = () => {
    const ROLES = {
        'User': 100,
        'Vendedor': 200,
        'Admin': 300
      };
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
            if (!err?.response) {
                setErrMsg('No responde el servidor ' + err);
            } else if (err.response?.status === 400) {
                setErrMsg('Usuario o contraseña incorrectos');
            } else if (err.response?.status === 401) {
                setErrMsg('Sin autorización');
            } else {
                setErrMsg('Error al ingresar');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Ingresar</h1>
            <form onSubmit={handleSubmit}>
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
                <button>Ingresar</button>
            </form>
            <p>
                ¿Necesitas una cuenta?<br />
                <span className="line">
                    <Link to="/registrarse">Registrarse</Link>
                </span>
            </p>
        </section>
    )
}

export default Login