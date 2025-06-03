import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import Input2 from "../../Componentes/Input.jsx";
import { CORREO_REGEX } from "../../Configuraciones/Validaciones.js";

// PrimeReact
import { Card } from "primereact/card";
import { Button } from "primereact/button";

// Axios
import axios from '../../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

const RecuperarPassword = () => {
    const [email, setEmail] = useState('');
    const [formValido, setFormValido] = useState(false);
    const [loading, setLoading] = useState(false);
    const toastRef = useRef();
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        setFormValido(CORREO_REGEX.test(val));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValido) {
            toastRef.current?.notiError("Correo inválido");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${URL_USUARIOSCONTROLLER}/resetearcontrasenia?para=${encodeURIComponent(email)}`
            );

            toastRef.current?.notiExito("Correo enviado con instrucciones para restablecer contraseña");
            navigate("/ingresar", { replace: true });

        } catch (err) {
            if (!err?.response) {
                toastRef.current?.notiError("Error de conexión con el servidor");
            } else if (err.response?.status === 404) {
                toastRef.current?.notiError("Correo no registrado");
            } else {
                toastRef.current?.notiError("Error al solicitar recuperación");
            }
        }

        setLoading(false);
    };

    return (
        <div className='rectangulo-centrado'>
            <Card className="cardCentrada">
                <Noti ref={toastRef} />

                <h3>Recuperar Contraseña</h3>
                <form onSubmit={handleSubmit}>
                    <Input2
                        titulo={"Correo electrónico"}
                        descripcion={`Correo con formato válido xxxx@xxxxx.xx`}
                        value={email}
                        onChange={handleEmailChange}
                        regex={CORREO_REGEX}
                        required={true}
                    />

                    <Button
                        disabled={!formValido}
                        loading={loading}
                        label="Enviar instrucciones"
                        type="submit"
                        style={{ marginTop: "1rem" }}
                    />
                </form>

                <p style={{ textAlign: 'center' }}>
                    ¿Ya la recordaste?<br />
                    <span className="line">
                        <Link to="/ingresar">Volver al login</Link>
                    </span>
                </p>
            </Card>
        </div>
    );
};

export default RecuperarPassword;
