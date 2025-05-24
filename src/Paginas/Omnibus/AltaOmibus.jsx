import { useState, useRef, useEffect } from "react";
import { SOLODIGITOS_REGEX } from "../../Configuraciones/Validaciones.js";
import Input2 from "../../Componentes/Input.jsx";
import CargaMasivaAsientos from "../../Componentes/CargaMasivaAsientos.jsx";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import { useNavigate } from 'react-router-dom';

//PrimeReact
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
//conexion
import axios, { URL_OMNIBUSCONTROLLER } from '../../Configuraciones/axios.js';

export default function AltaOmibus() {
    const [omnibus, setOmnibus] = useState({
        marca: '',
        cant_asientos: '',
        matricula: ''
    });

    const [formValido, setFormValido] = useState(false);
    const toastRef = useRef();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const valido =
            omnibus.marca &&
            SOLODIGITOS_REGEX.test(omnibus.cant_asientos) &&
            omnibus.cant_asientos > 0 &&
            omnibus.matricula
        setFormValido(valido);
    }, [omnibus]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValido) {
            toastRef.current?.notiError("Verifique los campos antes de enviar");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${URL_OMNIBUSCONTROLLER}/crearOmnibus`, omnibus, {
                headers: { 'Content-Type': 'application/json' }
            });

            toastRef.current?.notiExito("Ómnibus ingresado correctamente");
            setOmnibus({
                marca: '',
                cant_asientos: '',
                matricula: ''
            });
        } catch (error) {
            toastRef.current?.notiError("Error al registrar el ómnibus");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='rectangulo-centrado'>
            <Card className="cardCentrada">
                <Noti ref={toastRef} />

                <h3>Agregar asientos</h3>
                <CargaMasivaAsientos />

                <h3>Agregar ómnibus</h3>
                <form onSubmit={handleSubmit}>
                    <br />
                    <Input2
                        titulo={"Marca"}
                        value={omnibus.marca}
                        descripcion={`No puede estar vacío`}
                        onChange={(e) => {
                            const val = e.target.value;
                            setOmnibus(prev => ({ ...prev, marca: val }));
                        }}
                        required={true}
                    />

                    <Input2
                        titulo={"Cantidad de asientos"}
                        value={omnibus.cant_asientos}
                        descripcion={`Solo dígitos`}
                        regex={SOLODIGITOS_REGEX}
                        permitirTeclas={"int"}
                        onChange={(e) => {
                            const val = e.target.value;
                            setOmnibus(prev => ({ ...prev, cant_asientos: val }));
                        }}
                        required={true}
                    />

                    <Input2
                        titulo={"Matrícula"}
                        value={omnibus.matricula}
                        descripcion={`No puede estar vacío`}
                        onChange={(e) => {
                            const val = e.target.value;
                            setOmnibus(prev => ({ ...prev, matricula: val }));
                        }}
                        permitirTeclas={"alphanum"}
                        required={true}
                    />

                    <Button
                        disabled={!formValido}
                        loading={loading}
                        label="Crear ómnibus"
                        type="submit"
                    />

                    <Button label="Cancelar" type="button" onClick={() => navigate('/Dashboard')} severity="secondary" style={{ marginTop: "1rem" }} />
                </form>
            </Card>
        </div>
    )
}