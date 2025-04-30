import { useRef, useState, useEffect } from "react";
import { NOMBRE_REGEX, PASSWORD_REGEX, CORREO_REGEX } from "./Validaciones.ts";
import { Link, useNavigate, useLocation } from "react-router-dom"
//PrimeReact
import { Card } from "primereact/card";
//conexion
import axios from '../Configuraciones/axios';
const URL_USUARIOS = '/usuarios';

const Register = () => {
	const [usuario, setUsuario] = useState({
		nombre: '',
		apellido: '',
		email: '',
		password: '',
	});

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const userRef = useRef();
	const emailRef = useRef();
	const errRef = useRef();

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
			const response = await axios.post(`${URL_USUARIOS}/registrarse`, usuario, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log(response.data);

			setSuccess(true);
			setUsuario({});
			setMatchPwd('');
			navigate(from, { replace: true });
		} catch (err) {
			if (!err?.response) {
				setErrMsg('Error al conectar con el servidor ' + err);
			} else if (err.response?.status === 409) {
				setErrMsg('Nombre de usuario ya existe');
			} else {
				setErrMsg('Error al registrar');
			}
			errRef.current.focus();
		}
	}

	return (
		<div className='rectangulo-centrado'>
			{success ? (
				<section>
					<h1>Correcto!</h1>
					<p>
						<a href="/ingresar">Ingresar</a>
					</p>
				</section>
			) : (
				<Card title="Registrarse" className="cardCentrada">
					<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
					<form onSubmit={handleSubmit}>
						<label htmlFor="nombre">
							Nombre
						</label>
						<input
							type="text"
							id="nombre"
							ref={userRef}
							autoComplete="off"
							onChange={(e) =>
								setUsuario(prev => ({ ...prev, nombre: e.target.value }))
							}
							value={usuario.nombre}
							required
							aria-invalid={validName ? "false" : "true"}
							aria-describedby="nomnote"
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p id="nomnote" className={userFocus && usuario.nombre && !validName ? "instructions" : "offscreen"}>
							De 4 a 24 caracteres.<br />
							Debe comenzar con una letra.<br />
							Se permiten letras, números, guiones bajos y guiones.
						</p>

						<label htmlFor="apellido" style={{ marginTop: "15px" }}>
							Apellido
						</label>
						<input
							type="text"
							id="apellido"
							ref={userRef}
							autoComplete="off"
							onChange={(e) =>
								setUsuario(prev => ({ ...prev, apellido: e.target.value }))
							}
							value={usuario.apellido}
							required
							aria-invalid={validName ? "false" : "true"}
							aria-describedby="apenote"
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p id="apenote" className={userFocus && usuario.apellido && !validName ? "instructions" : "offscreen"}>
							De 4 a 24 caracteres.<br />
							Debe comenzar con una letra.<br />
							Se permiten letras, números, guiones bajos y guiones.
						</p>

						<label htmlFor="correo" style={{ marginTop: "15px" }}>
							Correo
						</label>
						<input
							type="text"
							id="correo"
							ref={emailRef}
							autoComplete="off"
							onChange={(e) =>
								setUsuario(prev => ({ ...prev, email: e.target.value }))
							}
							value={usuario.email}
							required
							aria-invalid={validemail ? "false" : "true"}
							aria-describedby="emailnote"
							onFocus={() => setemailFocus(true)}
							onBlur={() => setemailFocus(false)}
						/>
						<p id="emailnote" className={emailFocus && !validemail ? "instructions" : "offscreen"}>
							Correo con formato válido xxxx@gmail.com
						</p>

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
			)}
		</div>
	)
}

export default Register
