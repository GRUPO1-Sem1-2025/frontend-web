import { useState, useRef } from "react";
import { SOLODIGITOS_REGEX } from "../../Configuraciones/Validaciones.js";
import Input2 from "../../Componentes/Input.jsx";
import CargaMasivaAsientos from "../../Componentes/CargaMasivaAsientos.jsx";
import Noti from '../../Componentes/MsjNotificacion.jsx';
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

    const toastRef = useRef();
    const [marcaValido, setMarcaValido] = useState(false);
    const [matriculaValido, setMatriculaValido] = useState(false);
    const [asientosValido, setAsientosValido] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { marca, cant_asientos, matricula } = omnibus;

        if (!marca || !matricula || !SOLODIGITOS_REGEX.test(cant_asientos)) {
            toastRef.current?.notiError("Verifique los campos antes de enviar");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${URL_OMNIBUSCONTROLLER}/crearOmnibus`, omnibus, {
                headers: { 'Content-Type': 'application/json' }
            });

            toastRef.current?.notiExito("Ómnibus ingresado correctamente");
            setOmnibus({ marca: '', cant_asientos: '', matricula: '' });
            setMarcaValido(false);
            setMatriculaValido(false);
            setAsientosValido(false);
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
                            setMarcaValido(val.trim() !== "");
                        }}
                        onValidChange={setMarcaValido}
                        required = {true}
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
                            setAsientosValido(SOLODIGITOS_REGEX.test(val));
                        }}
                        onValidChange={setAsientosValido}
                        required = {true}
                    />

                    <Input2
                        titulo={"Matrícula"}
                        value={omnibus.matricula}
                        descripcion={`No puede estar vacío`}
                        onChange={(e) => {
                            const val = e.target.value;
                            setOmnibus(prev => ({ ...prev, matricula: val }));
                            setMatriculaValido(val.trim() !== "");
                        }}
                        onValidChange={setMatriculaValido}
                        permitirTeclas={"alphanum"}
                        required = {true}
                    />

                    <Button
                        disabled={!marcaValido || !matriculaValido || !asientosValido}
                        loading={loading}
                        label="Ingresar"
                        type="submit"
                        style={{ marginTop: "1rem" }}
                    />
                </form>
            </Card>
        </div>
    )
}