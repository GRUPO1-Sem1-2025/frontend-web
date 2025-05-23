import { useState, useRef, useEffect } from "react";
import { NOMBRE_REGEX, PASSWORD_REGEX, CORREO_REGEX } from "../../Configuraciones/Validaciones.js";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import CargaMasivaUsuarios from "../../Componentes/CargaMasivaUsuarios.jsx";
//PrimeReact
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
//conexion
import axios, { URL_USUARIOSCONTROLLER } from '../../Configuraciones/axios.js';

export default function AltaUsuario() {
	const today = new Date();

	const [cuenta, setCuenta] = useState({
		nombre: "",
		apellido: "",
		email: "",
		categoría: "",
		ci: "",
		fechaNac: today,
		rol: 0
	});

	//Fix fechas para Java
	const formatearFecha = (fechaDate) => {
		if (!fechaDate) return "";
		return fechaDate.toISOString().split("T")[0]; // "yyyy-mm-dd"
	};

	const [selectOrigen, setSelectOrigen] = useState(null);
	const [selectDestino, setSelectDestino] = useState(null);
	const [formValido, setFormValido] = useState(false);
	const [loading, setLoading] = useState(false);
	const [localidades, setLocalidades] = useState([]);
	const toastRef = useRef();

	useEffect(() => {
		const valido =
			cuenta.precio > 0 &&
			cuenta.fechaInicio &&
			cuenta.fechaFin &&
			cuenta.horaInicio &&
			cuenta.horaFin &&
			selectOrigen &&
			selectDestino &&
			selectOrigen.id !== selectDestino.id;

		setFormValido(valido);
	}, [cuenta, selectOrigen, selectDestino]);


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
		};

		console.log(cuentaFormateada);
		setLoading(true);
		try {
			await axios.post(`${URL_USUARIOSCONTROLLER}/crearCuenta`, cuentaFormateada, {
				headers: { 'Content-Type': 'application/json' }
			});

			toastRef.current?.notiExito("usuario ingresado correctamente");

			setCuenta({
				nombre: "",
				apellido: "",
				email: "",
				categoría: "",
				ci: "",
				fechaNac: today,
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
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, nombre: val }));
							setMarcaValido(val.trim() !== "");
						}}
						onValidChange={setMarcaValido}
						required={true}
					/>

					<Input2
						titulo={"Apellido"}
						value={cuenta.apellido}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, apellido: val }));
							setMarcaValido(val.trim() !== "");
						}}
						onValidChange={setMarcaValido}
						required={true}
					/>

					<Input2
						titulo={"Correo"}
						value={cuenta.email}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, email: val }));
							setMarcaValido(val.trim() !== "");
						}}
						onValidChange={setMarcaValido}
						required={true}
					/>

					<Input2
						titulo={"Categoria"}
						value={cuenta.categoría}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, categoría: val }));
							setMarcaValido(val.trim() !== "");
						}}
						onValidChange={setMarcaValido}
						required={true}
					/>

					<Input2
						titulo={"Cedula"}
						value={cuenta.ci}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setCuenta(prev => ({ ...prev, ci: val }));
							setMarcaValido(val.trim() !== "");
						}}
						onValidChange={setMarcaValido}
						required={true}
					/>

					<Calendar
						value={cuenta.fechaNac}
						dateFormat="dd/mm/yy"
						showIcon
						style={{ width: "100%", paddingBottom: "15px" }}
						minDate={today}
						onChange={(e) => {
							const nuevaFechaNac = e.value;
							// const nuevaFechaFin = new Date(nuevaFechaNac);
							// nuevaFechaFin.setDate(nuevaFechaNac.getDate() + 1);

							setCuenta(prev => ({
								...prev,
								fechaNac: nuevaFechaNac,
								// Ajustamos fechaFin si quedó fuera del rango permitido
								// fechaFin: prev.fechaFin <= nuevaFechaNac ? nuevaFechaFin : prev.fechaFin
							}));
						}}
					/>

					<FloatLabel style={{ paddingBottom: "20px" }}>
						<Dropdown value={selectDestino}
							options={localidades} optionLabel="label"
							optionGroupLabel="label" optionGroupChildren="items"
							filter loading={false} style={{ width: "100%" }}
							onChange={(e) => {
								const localidad = e.value;
								setSelectDestino(localidad);
								setCuenta(prev => ({ ...prev, idLocalidadDestino: localidad.id }));
							}} />
						<label htmlFor="dd-city">Rol</label>
					</FloatLabel>

					<Button
						disabled={!formValido}
						loading={loading}
						label="Crear usuario"
						type="submit"
						style={{ marginTop: "1rem" }}
					/>
				</form>
			</Card>
		</div>
	);
}