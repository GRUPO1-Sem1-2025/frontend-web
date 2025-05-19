import { useState, useRef, useEffect } from "react";
import { SOLODIGITOS_REGEX } from "../../Configuraciones/Validaciones.js";
import Noti from '../../Componentes/MsjNotificacion.jsx';
//PrimeReact
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
//conexion
import axios, { URL_LOCALIDADESCONTROLLER, URL_VIAJESCONTROLLER } from '../../Configuraciones/axios.js';

export default function AltaOmibus() {
    const [viaje, setViaje] = useState({
        precio: 0,
        fechaInicio: null,
        fechaFin: null,
        horaInicio: null,
        horaFin: null
    });

    //Fix fechas para Java
    const formatearFecha = (fechaDate) => {
        if (!fechaDate) return "";
        return fechaDate.toISOString().split("T")[0]; // "yyyy-mm-dd"
    };

    const formatearHora = (fechaDate) => {
        if (!fechaDate) return "";
        return fechaDate.toTimeString().split(" ")[0]; // "hh:mm:ss"
    };

    const [selectOrigen, setSelectOrigen] = useState(null);
    const [selectDestino, setSelectDestino] = useState(null);
    const [formValido, setFormValido] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localidades, setLocalidades] = useState([]);
    const toastRef = useRef();

    useEffect(() => {
        axios.get(`${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`)
            .then(response => {
                const data = response.data;

                const departamentosMap = {};

                data.forEach(localidad => {
                    const { id, nombre, departamento } = localidad;

                    if (!departamentosMap[departamento]) {
                        departamentosMap[departamento] = [];
                    }

                    departamentosMap[departamento].push({
                        label: nombre,
                        value: { id, nombre }
                    });
                });

                const localidadesAgrupadas = Object.keys(departamentosMap).map(dep => ({
                    label: dep,
                    items: departamentosMap[dep]
                }));

                setLocalidades(localidadesAgrupadas);
            })
            .catch(error => {
                console.error('Error al obtener localidades:', error);
            });
    }, []);

    useEffect(() => {
        const valido =
            viaje.precio > 0 &&
            viaje.fechaInicio &&
            viaje.fechaFin &&
            viaje.horaInicio &&
            viaje.horaFin &&
            selectOrigen &&
            selectDestino &&
            selectOrigen.id !== selectDestino.id;

        setFormValido(valido);
    }, [viaje, selectOrigen, selectDestino]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValido) {
            toastRef.current?.notiError("Verifique los campos antes de enviar");
            return;
        }

        //Fix fechas Java
        const viajeFormateado = {
            ...viaje,
            fechaInicio: formatearFecha(viaje.fechaInicio),
            fechaFin: formatearFecha(viaje.fechaFin),
            horaInicio: formatearHora(viaje.horaInicio),
            horaFin: formatearHora(viaje.horaFin)
        };

        console.log(viajeFormateado);
        setLoading(true);
        try {
            await axios.post(`${URL_VIAJESCONTROLLER}/crearViaje`, viajeFormateado, {
                headers: { 'Content-Type': 'application/json' }
            }); toastRef.current?.notiExito("Viaje ingresado correctamente");

            setViaje({
                precio: 0,
                fechaInicio: null,
                fechaFin: null,
                horaInicio: null,
                horaFin: null
            });
            setSelectOrigen(null);
            setSelectDestino(null);
        } catch (error) {
            toastRef.current?.notiError("Error al registrar el viaje");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='rectangulo-centrado'>
            <Card className="cardCentrada">
                <Noti ref={toastRef} />

                <h3>Crear viaje</h3>
                <form onSubmit={handleSubmit}>
                    <br />

                    <FloatLabel>
                        <InputNumber inputId="currency-uy" value={viaje.precio} mode="currency" currency="UYU" locale="es-UY" style={{ width: "100%", paddingBottom: "15px" }}
                            onValueChange={(e) => {
                                setViaje(prev => ({ ...prev, precio: e.value }));
                            }} />
                        <label htmlFor="currency-uy" className="font-bold block mb-2">Precio</label>
                    </FloatLabel>

                    <Calendar value={viaje.fechaInicio} dateFormat="dd/mm/yy" showIcon style={{ width: "100%", paddingBottom: "15px" }}
                        onChange={(e) => setViaje(prev => ({ ...prev, fechaInicio: e.value }))} />

                    <Calendar value={viaje.fechaFin} dateFormat="dd/mm/yy" showIcon style={{ width: "100%", paddingBottom: "15px" }}
                        onChange={(e) => setViaje(prev => ({ ...prev, fechaFin: e.value }))} />

                    <Calendar value={viaje.horaInicio} showIcon timeOnly icon={() => <i className="pi pi-clock" />} style={{ width: "100%", paddingBottom: "15px" }}
                        onChange={(e) => setViaje(prev => ({ ...prev, horaInicio: e.value }))} />

                    <Calendar value={viaje.horaFin} showIcon timeOnly icon={() => <i className="pi pi-clock" />} style={{ width: "100%", paddingBottom: "15px" }}
                        onChange={(e) => setViaje(prev => ({ ...prev, horaFin: e.value }))} />

                    <FloatLabel style={{ paddingBottom: "20px" }}>
                        <Dropdown value={selectOrigen} onChange={(e) => {
                            const localidad = e.value;
                            setSelectOrigen(localidad);
                            setViaje(prev => ({ ...prev, idLocalidadOrigen: localidad.id }));
                        }}
                            options={localidades} optionLabel="label"
                            optionGroupLabel="label" optionGroupChildren="items"
                            filter loading={false} style={{ width: "100%" }} />
                        <label htmlFor="dd-city">Origen</label>
                    </FloatLabel>

                    <FloatLabel style={{ paddingBottom: "20px" }}>
                        <Dropdown value={selectDestino} onChange={(e) => {
                            const localidad = e.value;
                            setSelectDestino(localidad);
                            setViaje(prev => ({ ...prev, idLocalidadDestino: localidad.id }));
                        }}
                            options={localidades} optionLabel="label"
                            optionGroupLabel="label" optionGroupChildren="items"
                            filter loading={false} style={{ width: "100%" }} />
                        <label htmlFor="dd-city">Destino</label>
                    </FloatLabel>

                    <Button
                        disabled={!formValido}
                        loading={loading}
                        label="Crear viaje"
                        type="submit"
                        style={{ marginTop: "1rem" }}
                    />
                </form>
            </Card>
        </div>
    );
}