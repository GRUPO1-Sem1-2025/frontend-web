import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

import axios from '../Configuraciones/axios';
const LOGIN_URL = '/usuarios';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${LOGIN_URL}/login`,
                JSON.stringify({ email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const token = response?.data?.token;
            //console.log(token);
            const roles = [100];//response?.data?.roles;
            setAuth({ email, roles, accessToken: token });
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