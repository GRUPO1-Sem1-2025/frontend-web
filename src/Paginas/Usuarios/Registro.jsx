import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"
import { NOMBRE_REGEX, PASSWORD_REGEX, CORREO_REGEX } from "../../Configuraciones/Validaciones.js";
import Noti from '../../Componentes/MsjNotificacion.jsx';
import Input2 from "../../Componentes/Input.jsx";

//PrimeReact
import { Card } from "primereact/card";
//conexion
import axios from '../../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

const Registro = () => {
	const [usuario, setUsuario] = useState({
		nombre: '',
		apellido: '',
		email: '',
		password: '',
	});

	const toastRef = useRef();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const userRef = useRef();
	const emailRef = useRef();

	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [validemail, setValidemail] = useState(false);
	const [emailFocus, setemailFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, [])

	useEffect(() => {
		setValidName(NOMBRE_REGEX.test(usuario.nombre));
	}, [usuario.nombre])

	useEffect(() => {
		setValidName(NOMBRE_REGEX.test(usuario.apellido));
	}, [usuario.apellido])

	useEffect(() => {
		setValidemail(CORREO_REGEX.test(usuario.email));
	}, [usuario.email])

	useEffect(() => {
		setValidPwd(PASSWORD_REGEX.test(usuario.password));
		setValidMatch(usuario.password === matchPwd);
	}, [usuario.password, matchPwd])

	useEffect(() => {
		setErrMsg('');
	}, [usuario.nombre, usuario.password, matchPwd])

	const handleSubmit = async (e) => {
		e.preventDefault();

		const v1 = NOMBRE_REGEX.test(usuario.nombre);
		const v2 = NOMBRE_REGEX.test(usuario.apellido);
		const v3 = PASSWORD_REGEX.test(usuario.password);
		const v4 = CORREO_REGEX.test(usuario.email);

		if (!v1 || !v2 || !v3 || !v4) {
			setErrMsg("Invalid Entry");
			return;
		}
		console.log(usuario);

		try {
			const response = await axios.post(`${URL_USUARIOSCONTROLLER}/registrarse`, usuario, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log(response.data);

			setSuccess(true);
			setUsuario({});
			setMatchPwd('');
			navigate("/ingresar", { replace: true });
		} catch (err) {
			if (!err?.response) {
				setErrMsg('Error al conectar con el servidor ' + err);
			} else if (err.response?.status === 409) {
				setErrMsg('Nombre de usuario ya existe');
			} else {
				setErrMsg('Error al registrar');
			}
		}
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

					<Input2
						titulo={"Correo"}
						value={usuario.email}
						descripcion={`Correo con formato válido xxxx@gmail.com`}
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
                        value={usuario.password}
                        onChange={(e) => {
                            const val = e.target.value;
                            setUsuario(prev => ({ ...prev, password: val }));
                        }}
                        required={true}
                    />

					<label htmlFor="password" style={{ marginTop: "15px" }}>
						Contraseña
					</label>
					<input
						type="password"
						id="password"
						onChange={(e) =>
							setUsuario(prev => ({ ...prev, password: e.target.value }))
						}
						value={usuario.password}
						required
						aria-invalid={validPwd ? "false" : "true"}
						aria-describedby="pwdnote"
						onFocus={() => setPwdFocus(true)}
						onBlur={() => setPwdFocus(false)}
					/>
					<p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
						De 8 a 24 caracteres<br />
						Debe incluir letras mayúsculas y minúsculas, un número y un carácter especial.<br />
						Caracteres especiales permitidos: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
					</p>

					<label htmlFor="confirm_pwd" style={{ marginTop: "15px" }}>
						Confirmar contraseña:
					</label>
					<input
						type="password"
						id="confirm_pwd"
						onChange={(e) => setMatchPwd(e.target.value)}
						value={matchPwd}
						required
						aria-invalid={validMatch ? "false" : "true"}
						aria-describedby="confirmnote"
						onFocus={() => setMatchFocus(true)}
						onBlur={() => setMatchFocus(false)}
					/>
					<p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
						Debe coincidir con el primer campo de contraseña.
					</p>

					<button disabled={!validName || !validPwd || !validMatch ? true : false} style={{ marginTop: "15px" }}>
						Registrarse
					</button>
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
