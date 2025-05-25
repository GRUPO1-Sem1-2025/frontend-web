import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { NOMBRE_REGEX, CORREO_REGEX } from "../../Configuraciones/Validaciones.js";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import CargaMasivaUsuarios from "../../Componentes/CargaMasivaUsuarios.jsx";
import Input2 from "../../Componentes/Input.jsx";
import InputCedula from "../../Componentes/InputCedula.jsx";
import { ROLES } from '../../Configuraciones/Constantes.js';

//PrimeReact
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
//conexion
import axios, { URL_USUARIOSCONTROLLER } from '../../Configuraciones/axios.js';

export default function AltaUsuario() {
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

	//###### Fixs para Java ######
	const formatearFecha = (fechaDate) => {
		if (!fechaDate) return "";
		return fechaDate.toISOString().split("T")[0]; // "yyyy-mm-dd"
	};

	//Quitar caaracteres especiales de cedula
	function limpiarNumeroDocumento(numero) {
		return numero.replace(/[.-]/g, '');
	}

	const [formValido, setFormValido] = useState(false);
	const [loading, setLoading] = useState(false);
	const toastRef = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		const valido =
			cuenta.rol &&
			cuenta.fechaNac &&
			cuenta.nombre &&
			cuenta.apellido &&
			CORREO_REGEX.test(cuenta.email) &&
			cuenta.ci
		setFormValido(valido);
	}, [cuenta]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formValido) {
			toastRef.current?.notiError("Verifique los campos antes de enviar");
			return;
		}

		//Fix fechas Java
		const cuentaFormateada = {
			...cuenta,
			fechaNac: formatearFecha(cuenta.fechaNac),
			ci: limpiarNumeroDocumento(cuenta.ci)
		};

		console.log(cuentaFormateada);
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
		} catch (error) {
			toastRef.current?.notiError("Error al registrar el usuario");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='rectangulo-centrado'>
			<Card className="cardCentrada">
				<Noti ref={toastRef} />

				<h3>Alta masiva usuarios</h3>
				<CargaMasivaUsuarios />

				<h3>Crear usuario</h3>
				<form onSubmit={handleSubmit}>
					<br />

					<Input2
						titulo={"Nombre"}
						value={cuenta.nombre}
						descripcion={`Al menos 4 caracteres`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, nombre: val }));
						}}
						regex={NOMBRE_REGEX}
						required={true}
					/>

					<Input2
						titulo={"Apellido"}
						value={cuenta.apellido}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, apellido: val }));
						}}
						required={true}
					/>

					<Input2
						titulo={"Correo"}
						value={cuenta.email}
						descripcion={`Correo con formato válido xxxx@gmail.com`}
						regex={CORREO_REGEX}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, email: val }));
						}}
						required={true}
					/>

					<Input2 //Posiblemente se borra
						titulo={"Categoria"}
						value={cuenta.categoría}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, categoría: val }));
						}}
						required={true}
					/>

					<InputCedula
						value={cuenta.ci}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, ci: val }));
						}}
						required={true}
					/>

					<Calendar
						value={cuenta.fechaNac}
						dateFormat="dd/mm/yy"
						showIcon
						style={{ width: "100%", paddingBottom: "15px" }}
						maxDate={fechaMenos17Anios}
						onChange={(e) => {
							const nuevaFechaNac = e.value;
							setCuenta(prev => ({
								...prev,
								fechaNac: nuevaFechaNac,
							}));
						}}
						required={true}
					/>

					<FloatLabel>
						<Dropdown
							value={cuenta.rol}
							options={rolesOrdenados}
							optionLabel="label"
							placeholder="Seleccione un rol"
							style={{ width: "100%" }}
							clearIcon={true}
							required={true}
							onChange={(e) => setCuenta(prev => ({ ...prev, rol: e.value }))}
						/>
						<label htmlFor="rol">Rol</label>
					</FloatLabel>

					<Button
						disabled={!formValido}
						loading={loading}
						label="Crear usuario"
						type="submit"
						style={{ marginTop: "1rem" }}
					/>

					<Button label="Cancelar" type="button" onClick={() => navigate('/Dashboard')} severity="secondary" style={{ marginTop: "1rem" }} />
				</form>
			</Card>
		</div>
	);
}