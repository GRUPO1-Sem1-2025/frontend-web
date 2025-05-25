import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"
import { NOMBRE_REGEX, PASSWORD_REGEX, CORREO_REGEX } from "../../Configuraciones/Validaciones.js";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import Input2 from "../../Componentes/Input.jsx";

//PrimeReact
import { Card } from "primereact/card";
//conexion
import axios from '../../Configuraciones/axios.js';
import { Calendar } from "primereact/calendar";
import { Button } from 'primereact/button';

import InputCedula from "../../Componentes/InputCedula.jsx";
const URL_USUARIOSCONTROLLER = '/usuarios';

const Registro = () => {
	const today = new Date();
	const fechaMenos9Anios = new Date(today);
	fechaMenos9Anios.setFullYear(fechaMenos9Anios.getFullYear() - 9);

	const [usuario, setUsuario] = useState({
		nombre: '',
		apellido: '',
		email: '',
		password: '',
		ci: null,
		fechaNac: fechaMenos9Anios,
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
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const [matchPwd, setMatchPwd] = useState('');

	const [errMsg, setErrMsg] = useState('');

	useEffect(() => {
		const valido =
			usuario.fechaNac &&
			NOMBRE_REGEX.test(usuario.nombre) &&
			usuario.password &&
			usuario.apellido &&
			CORREO_REGEX.test(usuario.email) &&
			usuario.ci &&
			matchPwd &&
			usuario.password === matchPwd;
		setFormValido(valido);
	}, [usuario, matchPwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formValido) {
			toastRef.current?.notiError("Verifique los campos antes de enviar");
			return;
		}

		console.log(usuario);
		setLoading(true);

		//Fix fechas Java
		const usuarioFormateado = {
			...usuario,
			fechaNac: formatearFecha(usuario.fechaNac),
			ci: limpiarNumeroDocumento(usuario.ci),
			categoria: "GENERAL"
		};

		try {
			const response = await axios.post(`${URL_USUARIOSCONTROLLER}/registrarse`, usuarioFormateado, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log(response.data);

			setUsuario({});
			setMatchPwd('');
			navigate("/ingresar", { replace: true });
		} catch (err) {
			if (!err?.response) {
				toastRef.current?.notiError('Error al conectar con el servidor ' + err);
			} else if (err.response?.status === 409) {
				toastRef.current?.notiError('Nombre de usuario ya existe');
			} else {
				toastRef.current?.notiError('Error al registrar');
			}
		}

		setLoading(false);
	}

	return (
		<div className='rectangulo-centrado'>
			<Card className="cardCentrada">
				<Noti ref={toastRef} />

				<h3>Registrarse</h3>
				<form onSubmit={handleSubmit}>

					<Input2
						titulo={"Nombre"}
						value={usuario.nombre}
						descripcion={`De 4 a 24 caracteres.\n Debe comenzar con una letra.\n Se permiten letras, números, guiones bajos y guiones.`}
						onChange={(e) => {
							const val = e.target.value;
							setUsuario(prev => ({ ...prev, nombre: val }));
						}}
						regex={NOMBRE_REGEX}
						required={true}
					/>

					<Input2
						titulo={"Apellido"}
						value={usuario.apellido}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setUsuario(prev => ({ ...prev, apellido: val }));
						}}
						required={true}
					/>
					<InputCedula
						value={usuario.ci}
						descripcion={`No puede estar vacío`}
						onChange={(e) => {
							const val = e.target.value;
							setUsuario(prev => ({ ...prev, ci: val }));
						}}
						required={true}
					/>

					<Calendar
						value={usuario.fechaNac}
						dateFormat="dd/mm/yy"
						showIcon
						style={{ width: "100%", paddingBottom: "15px" }}
						maxDate={fechaMenos9Anios}
						onChange={(e) => {
							const nuevaFechaNac = e.value;
							setUsuario(prev => ({
								...prev,
								fechaNac: nuevaFechaNac,
							}));
						}}
						required={true}
					/>

					<Input2
						titulo={"Correo"}
						value={usuario.email}
						descripcion={`Correo con formato válido xxxx@xxxxx.xx`}
						regex={CORREO_REGEX}
						onChange={(e) => {
							const val = e.target.value;
							setUsuario(prev => ({ ...prev, email: val }));
						}}
						required={true}
					/>

					<Input2
						type="password"
						titulo={"Contraseña"}
						value={usuario.password}
						onChange={(e) => {
							const val = e.target.value;
							setUsuario(prev => ({ ...prev, password: val }));
						}}
						required={true}
					/>

					<Input2
						type="password"
						titulo={"Confirmar contraseña"}
						descripcion={"Debe coincidir con el primer campo de contraseña."}
						value={matchPwd}
						onChange={(e) => setMatchPwd(e.target.value)}
						required={true}
					/>

					<Button
						disabled={!formValido}
						loading={loading}
						label="Registrarse"
						type="submit"
						style={{ marginTop: "1rem" }}
					/>
				</form>

				<p style={{ textAlign: 'center' }}>
					¿Ya estas registrado?<br />
					<span className="line">
						<Link to="/ingresar">Login</Link>
					</span>
				</p>
			</Card>
		</div>
	)
}

export default Registro