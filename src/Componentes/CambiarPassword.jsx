import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input2 from "./Input.jsx";
import Noti from './MsjNotificacion.jsx';
import AuthContext from "../Context/AuthProvider.jsx";

//PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

//Conexion
import axios from '../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

export default function CambiarPassword({ usaHeader = true, propEmail = null }) {
    const [post, setPost] = useState({
        email: '',
        old_pass: '',
        new_pass: '',
        new_pass1: ''
    });
    //Variables
    const [formValido, setFormValido] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toastRef = useRef();
    const [loading, setLoading] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        const valido =
            post.email &&
            post.old_pass &&
            post.new_pass &&
            post.new_pass1 &&
            post.new_pass === post.new_pass1 &&
            post.old_pass !== post.new_pass;
        setFormValido(valido);
        console.log(valido, post);
    }, [post]);

    useEffect(() => {
        const varEmail = propEmail || location.state?.email || "";
        setPost(prev => ({ ...prev, email: varEmail }));
    }, [location.state?.email, propEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formValido) {
            toastRef.current?.notiAdvertencia('El formulario debe ser válido');
            return;
        }

        try {
            const response = await axios.post(`${URL_USUARIOSCONTROLLER}/cambiarContrasenia`,
                JSON.stringify(post),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            setAuth({});
            console.log(response?.data);
            navigate("/ingresar", { replace: true });
        } catch (err) {
            let msg = '';

            if (!err?.response) {
                msg = 'No responde el servidor:\n' + err;
            } else if (err.response?.status === 400) {
                msg = ' Nuevas contraseñas no coinciden';
            } else if (err.response?.status === 409) {
                msg = 'La contraseña ingresada no coincide con la registrada en el sistema';
            } else if (err.response?.status === 500) {
                msg = 'Usuario no encontrado';
            } else {
                msg = 'Error al cambiar la contraseña';
            }

            toastRef.current?.notiError(msg);
        }
        setLoading(false);
    }

    //solo se muestra en login no directo
    const header = usaHeader && (
        <img
            alt="Card"
            src="/tecnobus.png"
            style={{
                width: '100%',
                maxWidth: '500px',
                minWidth: '400px',
                height: '250px',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '1%',
            }}
        />
    );

    return (
        <div
            className={usaHeader ? 'rectangulo-centrado' : ''}
            style={{
                padding: "0px",
                ...(usaHeader === false && {
                    display: 'flex',
                    justifyContent: 'center'
                })
            }}
        >
            <Card title={usaHeader ? 'Recuperación de contraseña' : 'Cambiar Contraseña'} header={header} style={{ maxWidth: '420px', textAlign: 'center' }}>
                <Noti ref={toastRef} />
                <form onSubmit={handleSubmit} >
                    <div className="card flex justify-content-center">
                        <Input2
                            type="password"
                            titulo={"Contraseña anterior"}
                            value={post.old_pass}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPost(prev => ({ ...prev, old_pass: val }));
                            }}
                            required={true}
                        />

                        <Input2
                            type="password"
                            titulo={"Contraseña nueva"}
                            value={post.new_pass}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPost(prev => ({ ...prev, new_pass: val }));
                            }}
                            required={true}
                        />

                        <Input2
                            type="password"
                            titulo={"Confirmar contraseña"}
                            descripcion={"Debe coincidir con el primer campo de contraseña."}
                            value={post.new_pass1}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPost(prev => ({ ...prev, new_pass1: val }));
                            }}
                            required={true}
                        />
                    </div>

                    <p style={{ marginTop: "0.2em" }}>
                        <Button label="Cancel" type="button" onClick={() => navigate('/ingresar')} severity="secondary" />
                        <Button label="Cambiar" type="submit" style={{ marginLeft: '0.5em' }} disabled={!formValido} loading={loading} />
                    </p>
                </form>
            </Card>
        </div>
    )
}