import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider.jsx";
import axios from '../Configuraciones/axios';
const LOGIN_URL = '/usuarios';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

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

            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const token = response?.data?.token;
            console.log(token);
            const roles = ''; //response?.data?.roles;           
            setAuth({ email, pwd, roles, accessToken: token }); // produce error, faltan datos
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No responde el servidor ' +  err);
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
        <>
            {success ? (
                <section>
                    <h1>Ingreso exitoso</h1>
                    <br />
                    <p>
                        <a href="#">Ir al dashboard</a>
                    </p>
                </section>
            ) : (
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
                            {/*put router link here*/}
                            <a href="#">Registrarse</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login