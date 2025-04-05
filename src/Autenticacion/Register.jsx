import { useRef, useState, useEffect } from "react";
import { API_URL } from "../Configuraciones/Constantes.ts";
import { NOMBRE_REGEX, PASSWORD_REGEX, CORREO_REGEX } from "./Validaciones.ts";

const URL_USUARIOS = '/usuarios';

const Register = () => {
	const userRef = useRef();
	const emailRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [email, setemail] = useState('');
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
		setValidName(NOMBRE_REGEX.test(user));
	}, [user])

	useEffect(() => {
		setValidemail(CORREO_REGEX.test(email));
	}, [email])

	useEffect(() => {
		setValidPwd(PASSWORD_REGEX.test(pwd));
		setValidMatch(pwd === matchPwd);
	}, [pwd, matchPwd])

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd, matchPwd])

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if button enabled with JS hack
		const v1 = NOMBRE_REGEX.test(user);
		const v2 = PASSWORD_REGEX.test(pwd);
		const v3 = CORREO_REGEX.test(email);

		if (!v1 || !v2 || !v3) {
			setErrMsg("Invalid Entry");
			return;
		}
		try {
			console.info(`${API_URL}/${URL_USUARIOS}`);
			console.info(`${user} - ${email} - ${pwd}`);

			await crearUsuario({ user, email, pwd });

			console.log(response?.data);
			console.log(response?.accessToken);
			console.log(JSON.stringify(response))
			setSuccess(true);
			// //clear state and controlled inputs
			// //need value attrib on inputs for this
			setUser('');
			setemail('');
			setPwd('');
			setMatchPwd('');
		} catch (err) {
			if (!err?.response) {
				setErrMsg('Error al conectar con el servidor');
			} else if (err.response?.status === 409) {
				setErrMsg('Nombre de usuario ya existe');
			} else {
				setErrMsg('Error al registrar');
			}
			errRef.current.focus();
		}
	}

	async function crearUsuario({ nombre, email, password }) {
		const usuario = { nombre, email, password };

		const response = await fetch(`${API_URL}/usuarios`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(usuario)
		});

		return response.json();
	}

	return (
		<>
			{success ? (
				<section>
					<h1>Correcto!</h1>
					<p>
						<a href="#">Registrarse</a>
					</p>
				</section>
			) : (
				<section>
					<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="nombre">
							Nombre de usuario:
						</label>
						<input
							type="text"
							id="nombre"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							value={user}
							required
							aria-invalid={validName ? "false" : "true"}
							aria-describedby="uidnote"
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
							De 4 a 24 caracteres.<br />
							Debe comenzar con una letra.<br />
							Se permiten letras, números, guiones bajos y guiones.
						</p>

						<label htmlFor="correo">
							Correo:
						</label>
						<input
							type="text"
							id="correo"
							ref={emailRef}
							autoComplete="off"
							onChange={(e) => setemail(e.target.value)}
							value={email}
							required
							aria-invalid={validemail ? "false" : "true"}
							aria-describedby="emailnote"
							onFocus={() => setemailFocus(true)}
							onBlur={() => setemailFocus(false)}
						/>
						<p id="emailnote" className={emailFocus && !validemail ? "instructions" : "offscreen"}>
							Correo con formato válido xxxx@gmail.com
						</p>

						<label htmlFor="password">
							Contraseña:
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							value={pwd}
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

						<label htmlFor="confirm_pwd">
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

						<button disabled={!validName || !validPwd || !validMatch ? true : false}>
							Registrarse
						</button>
					</form>
					<p>
						Ya estas registrado?<br />
						<span className="line">
							{/*put router link here*/}
							<a href="#">Ingresar</a>
						</span>
					</p>
				</section>
			)}
		</>
	)
}

export default Register
