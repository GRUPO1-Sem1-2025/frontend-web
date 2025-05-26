import { useState, useRef, useEffect } from "react";
import { NOMBRE_REGEX, CORREO_REGEX } from "../Configuraciones/Validaciones.js";
import Noti from '../Componentes/MsjNotificacion.jsx';
import Input2 from "../Componentes/Input.jsx";
import InputCedula from "../Componentes/InputCedula.jsx";
import { ROLES } from '../Configuraciones/Constantes.js';
import axios, { URL_USUARIOSCONTROLLER } from '../Configuraciones/axios.js';

// PrimeReact
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

export default function AltaUsuarioModal({ visible, onHide }) {
	const today = new Date();
	const fechaMenos17Anios = new Date(today);
	fechaMenos17Anios.setFullYear(fechaMenos17Anios.getFullYear() - 17);

	const rolesOrdenados = Object.entries(ROLES)
		.filter(([label]) => label !== 'User')
		.sort((a, b) => a[1] - b[1])
		.map(([label]) => ({ label, value: label }));

	const [cuenta, setCuenta] = useState({
		nombre: "",
		apellido: "",
		email: "",
		categoría: "GENERAL",
		ci: null,
		fechaNac: fechaMenos17Anios,
		rol: null
	});

	const [formValido, setFormValido] = useState(false);
	const [loading, setLoading] = useState(false);
	const toastRef = useRef();

	const formatearFecha = (fechaDate) => fechaDate?.toISOString().split("T")[0];
	const limpiarNumeroDocumento = (numero) => numero.replace(/[.-]/g, '');

	useEffect(() => {
		const valido =
			cuenta.rol &&
			cuenta.fechaNac &&
			cuenta.nombre &&
			cuenta.apellido &&
			CORREO_REGEX.test(cuenta.email) &&
			cuenta.ci;
		setFormValido(valido);
	}, [cuenta]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formValido) {
			toastRef.current?.notiError("Verifique los campos antes de enviar");
			return;
		}

		const cuentaFormateada = {
			...cuenta,
			fechaNac: formatearFecha(cuenta.fechaNac),
			ci: limpiarNumeroDocumento(cuenta.ci)
		};

		setLoading(true);
		try {
			await axios.post(`${URL_USUARIOSCONTROLLER}/crearCuenta`, cuentaFormateada, {
				headers: { 'Content-Type': 'application/json' }
			});
			toastRef.current?.notiExito("Usuario ingresado correctamente");
			setCuenta({
				nombre: "",
				apellido: "",
				email: "",
				categoría: "GENERAL",
				ci: "",
				fechaNac: fechaMenos17Anios,
				rol: 0
			});
			onHide(); // cerrar modal
		} catch (error) {
			toastRef.current?.notiError("Error al registrar el usuario");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog header="Alta de Usuario" visible={visible} style={{ width: '40vw' }} onHide={onHide}>
			<Noti ref={toastRef} />

			<form onSubmit={handleSubmit}>
				<Input2 titulo="Nombre" value={cuenta.nombre} regex={NOMBRE_REGEX} required
					descripcion="Al menos 4 caracteres"
					onChange={(e) => setCuenta(prev => ({ ...prev, nombre: e.target.value }))} />

				<Input2 titulo="Apellido" value={cuenta.apellido} required
					descripcion="No puede estar vacío"
					onChange={(e) => setCuenta(prev => ({ ...prev, apellido: e.target.value }))} />

				<Input2 titulo="Correo" value={cuenta.email} regex={CORREO_REGEX} required
					descripcion="Correo con formato válido"
					onChange={(e) => setCuenta(prev => ({ ...prev, email: e.target.value }))} />

				<Input2 titulo="Categoría" value={cuenta.categoría} required
					onChange={(e) => setCuenta(prev => ({ ...prev, categoría: e.target.value }))} />

				<InputCedula value={cuenta.ci} required
					onChange={(e) => setCuenta(prev => ({ ...prev, ci: e.target.value }))} />

				<Calendar value={cuenta.fechaNac} showIcon maxDate={fechaMenos17Anios}
					onChange={(e) => setCuenta(prev => ({ ...prev, fechaNac: e.value }))} />

				<FloatLabel>
					<Dropdown value={cuenta.rol} options={rolesOrdenados} optionLabel="label" style={{ width: '100%', marginTop: "1rem" }}
						placeholder="Seleccione un rol"
						onChange={(e) => setCuenta(prev => ({ ...prev, rol: e.value }))} />
					<label htmlFor="rol">Rol</label>
				</FloatLabel>

				<Button label="Crear usuario" type="submit" loading={loading} disabled={!formValido} style={{ marginTop: "1rem" }} />
			</form>
		</Dialog>
	);
}