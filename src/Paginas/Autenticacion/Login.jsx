import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input2 from "../../Componentes/Input.jsx";
import { CORREO_REGEX } from '../../Configuraciones/Validaciones.js';
import Noti from '../../Componentes/MsjNotificacion.jsx';
//PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
//Conexion
import axios from '../../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

const Login = () => {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: '',//
        password: '', //Para test 123456Aa@
        codigo: 0,
    });

    const toastRef = useRef();
    const navigate = useNavigate();

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
    }

    return (
        <div className='rectangulo-centrado' style={{ padding: "0px" }}>
            <Card title="Iniciar sesión" header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
                <Noti ref={toastRef} />

                <form onSubmit={handleSubmit} >
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
                        <Button label="Cancelar" onClick={() => navigate('/links')} severity="secondary" />
                        <Button label="Ingresar" type="submit" style={{ marginLeft: '0.5em' }} />
                    </p>
                </form>
                <Divider />

                <p style={{ marginTop: '0.5em' }} >
                    ¿Necesitas una cuenta?
                    <br />
                    <Link to="/registrarse">Registrarse</Link>
                </p>
            </Card>
        </div>
    )
}

export default Login