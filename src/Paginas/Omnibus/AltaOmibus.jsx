import { useRef, useState, useEffect } from "react";
import { NOMBRE_REGEX, PASSWORD_REGEX, CORREO_REGEX, SOLODIGITOS_REGEX } from "../../Configuraciones/Validaciones.js";
import Input2 from "../../Componentes/Input.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom"
//PrimeReact
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
//conexion
import axios from '../../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

export default function AltaOmibus() {
    const [omnibus, setUsuario] = useState({
        marca: '',
        cantidadAsientos: '',
        matricula: '',
        activo: '',
    });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const errRef = useRef();
    const [validName, setValidName] = useState(false);

    const [validPwd, setValidPwd] = useState(false);

    const [validemail, setValidemail] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidName(NOMBRE_REGEX.test(omnibus.nombre));
    }, [omnibus.nombre])

    useEffect(() => {
        setValidName(NOMBRE_REGEX.test(omnibus.apellido));
    }, [omnibus.apellido])

    useEffect(() => {
        setValidemail(CORREO_REGEX.test(omnibus.email));
    }, [omnibus.email])

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(omnibus.password));
        setValidMatch(omnibus.password === matchPwd);
    }, [omnibus.password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [omnibus.nombre, omnibus.password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1 = NOMBRE_REGEX.test(omnibus.nombre);
        const v2 = NOMBRE_REGEX.test(omnibus.apellido);
        const v3 = PASSWORD_REGEX.test(omnibus.password);
        const v4 = CORREO_REGEX.test(omnibus.email);

        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }
        console.log(omnibus);

        try {
            // const response = await axios.post(`${URL_USUARIOSCONTROLLER}/registrarse`, usuario, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            console.log(response.data);

            setSuccess(true);
            navigate("/ingresar", { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Error al conectar con el servidor ' + err);
            } else if (err.response?.status === 409) {
                setErrMsg('Nombre de usuario ya existe');
            } else {
                setErrMsg('Error al registrar');
            }
            errRef.current.focus();
        }
    }

    const [marcaValido, setMarcaValido] = useState(true);
    const [matriculaValido, setMatriculaValido] = useState(true);
    const [loading, setLoading] = useState(false);
    const [asientos, setAsientos] = useState(1);

    const load = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    //Notificaciones
    const toast = useRef(null);

    const showWarn = (message) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Error',
            detail: message,
            life: 6000
        });
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 6000 });
    }

    return (
        <div className='rectangulo-centrado'>
            <Card title="Agregar ómnibus" className="cardCentrada">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <form onSubmit={handleSubmit}>
                    <Input2
                        titulo={"Marca"}
                        value={omnibus.marca}
                        descripcion={`Debe tener al menos 3 caracteres.\nDebe comenzar con una letra.\nSolo letras, números y guiones.`}
                        onChange={(e) => setUsuario(prev => ({ ...prev, marca: e.target.value }))}
                        regex={NOMBRE_REGEX}
                        onValidChange={setAsientos}
                    />

                    <Input2
                        titulo={"Cantidad de asientos"}
                        value={omnibus.cantidadAsientos}
                        descripcion={`Solo dígitos`}
                        onChange={(e) => setUsuario(prev => ({ ...prev, cantidadAsientos: e.target.value }))}
                        regex={SOLODIGITOS_REGEX}
                        onValidChange={setMarcaValido}
                        permitirTeclas={"int"}
                    />

                    <Input2
                        titulo={"Matrícula"}
                        value={omnibus.matricula}
                        descripcion={`Caracteres alfanuméricos`}
                        onChange={(e) => setUsuario(prev => ({ ...prev, matricula: e.target.value }))}
                        onValidChange={setMatriculaValido}
                        permitirTeclas={"alphanum"}
                    />

                    <Button disabled={!marcaValido || !matriculaValido || !asientos ? true : false} loading={loading} onClick={load} label="Ingresar" />
                </form>
            </Card>
        </div>
    )
}