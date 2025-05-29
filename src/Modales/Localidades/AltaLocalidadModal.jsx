import { useState, useEffect, forwardRef, useRef } from "react";
import Input2 from "../../Componentes/Input.jsx";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import axios, { URL_LOCALIDADESCONTROLLER } from '../../Configuraciones/axios.js';

//PrimeReact
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const AltaLocalidadModal = forwardRef(({ visible, onHide, onSuccess }, ref) => {
    const [localidad, setLocalidad] = useState({
        nombre: '',
        departamento: ''
    });

    const departamentosUruguay = [
        { label: 'Artigas', value: 'Artigas' },
        { label: 'Canelones', value: 'Canelones' },
        { label: 'Cerro Largo', value: 'Cerro Largo' },
        { label: 'Colonia', value: 'Colonia' },
        { label: 'Durazno', value: 'Durazno' },
        { label: 'Flores', value: 'Flores' },
        { label: 'Florida', value: 'Florida' },
        { label: 'Lavalleja', value: 'Lavalleja' },
        { label: 'Maldonado', value: 'Maldonado' },
        { label: 'Montevideo', value: 'Montevideo' },
        { label: 'Paysandú', value: 'Paysandú' },
        { label: 'Río Negro', value: 'Río Negro' },
        { label: 'Rivera', value: 'Rivera' },
        { label: 'Rocha', value: 'Rocha' },
        { label: 'Salto', value: 'Salto' },
        { label: 'San José', value: 'San José' },
        { label: 'Soriano', value: 'Soriano' },
        { label: 'Tacuarembó', value: 'Tacuarembó' },
        { label: 'Treinta y Tres', value: 'Treinta y Tres' }
    ];

    const [formValido, setFormValido] = useState(false);
    const [loading, setLoading] = useState(false);
    const toastRef = ref;

    useEffect(() => {
        const valido =
            localidad.nombre &&
            localidad.departamento;
        setFormValido(valido);
    }, [localidad]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValido) {
            toastRef.current?.notiError("Verifique los campos antes de enviar");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${URL_LOCALIDADESCONTROLLER}/agregarlocalidad`, localidad, {
                headers: { 'Content-Type': 'application/json' }
            });

            toastRef.current?.notiExito("Localidad ingresada correctamente");
            setLocalidad({ nombre: '', departamento: ''});
            onSuccess?.(); // llama a actualizar la lista en el padre
            onHide(); // Cierra el modal
        } catch (error) {
            let msg = '';

            if (!error?.response) {
                msg = 'No responde el servidor:\n' + error;
            } else if (error.response?.status === 406) {
                msg = error.response?.data?.mensaje || 'No es posible una respuesta exitosa';
            } else {
                msg = 'Error al ingresar';
            }

            toastRef.current?.notiError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog header="Alta de localidad" visible={visible} onHide={onHide} style={{ width: '30vw' }} modal>
            <form onSubmit={handleSubmit}>
                <Noti ref={toastRef} />

                <FloatLabel>
                    <Dropdown
                        value={localidad.departamento}
                        options={departamentosUruguay}
                        optionLabel="label"
                        style={{ width: '100%', marginBottom: "1rem" }}
                        placeholder="Seleccione un departamento"
                        onChange={(e) => setLocalidad(prev => ({ ...prev, departamento: e.value }))}
                    />
                    <label htmlFor="departamento">Departamento</label>
                </FloatLabel>

                <Input2
                    titulo={"Nombre"}
                    value={localidad.nombre}
                    descripcion={`No puede estar vacío`}
                    permitirTeclas={"alphanum"}
                    onChange={(e) => setLocalidad(prev => ({ ...prev, nombre: e.target.value }))}
                    required={true}
                />

                <Button label="Crear" type="submit" loading={loading} disabled={!formValido} />
            </form>
        </Dialog>
    );
});

export default AltaLocalidadModal;