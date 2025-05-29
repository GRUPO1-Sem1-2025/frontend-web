import { useState, useEffect, forwardRef, useRef } from "react";
import { SOLODIGITOS_REGEX } from "../../Configuraciones/Validaciones.js";
import Input2 from "../../Componentes/Input.jsx";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios, { URL_OMNIBUSCONTROLLER } from '../../Configuraciones/axios.js';
import { Messages } from 'primereact/messages';

const AltaOmnibusModal = forwardRef(({ visible, onHide, onSuccess }, ref) => {
    const [omnibus, setOmnibus] = useState({
        marca: '',
        cant_asientos: '',
        matricula: ''
    });

    const [formValido, setFormValido] = useState(false);
    const [loading, setLoading] = useState(false);
    const toastRef = ref;
    const mensaje = useRef(null);

    useEffect(() => {
        const valido =
            omnibus.marca &&
            SOLODIGITOS_REGEX.test(omnibus.cant_asientos) &&
            omnibus.cant_asientos > 0 &&
            omnibus.matricula;
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
            setOmnibus({ marca: '', cant_asientos: '', matricula: '' });
            onSuccess?.(); // llama a actualizar la lista en el padre
            onHide(); // Cierra el modal
        } catch (error) {
            let msg = '';

            if (!error?.response) {
                msg = 'No responde el servidor:\n' + error;
            } else if (error.response?.status === 406) {
                msg = error.response?.data?.mensaje || 'No es psoible una respuesta exitosa';
                mensaje.current.show([{ sticky: true, severity: 'warn', detail: 'Debe cargar más asientos para poder crear este ómnibus', closable: true }]);
            } else {
                msg = 'Error al ingresar';
            }

            toastRef.current?.notiError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog header="Alta de Ómnibus" visible={visible} onHide={onHide} style={{ width: '30vw' }} modal>
            <form onSubmit={handleSubmit}>
                <Noti ref={toastRef} />

                <Input2
                    titulo={"Marca"}
                    value={omnibus.marca}
                    descripcion={`No puede estar vacío`}
                    onChange={(e) => setOmnibus(prev => ({ ...prev, marca: e.target.value }))}
                    required={true}
                />

                <Input2
                    titulo={"Cantidad de asientos"}
                    value={omnibus.cant_asientos}
                    descripcion={`Solo dígitos`}
                    regex={SOLODIGITOS_REGEX}
                    permitirTeclas={"int"}
                    onChange={(e) => setOmnibus(prev => ({ ...prev, cant_asientos: e.target.value }))}
                    required={true}
                />

                <Input2
                    titulo={"Matrícula"}
                    value={omnibus.matricula}
                    descripcion={`No puede estar vacío`}
                    permitirTeclas={"alphanum"}
                    onChange={(e) => setOmnibus(prev => ({ ...prev, matricula: e.target.value }))}
                    required={true}
                />

                <Messages style={{ marginBottom: '1rem' }} ref={mensaje} />

                <Button label="Crear" type="submit" loading={loading} disabled={!formValido} />
            </form>
        </Dialog>
    );
});

export default AltaOmnibusModal;