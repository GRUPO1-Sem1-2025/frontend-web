import { useRef, useState, useEffect } from 'react';
import axios from '../Configuraciones/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

const CONTROLLER_URL = '/usuarios';

const ROLES = {
    'User': 100,
    'Vendedor': 200,
    'Admin': 300
};

const EditarRol = () => {
    const { setAuth } = useAuth();
    const { auth } = useAuth();

    const [selectedRole, setSelectedRole] = useState('User');
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const email = auth.email; // O podés hacerlo dinámico con un input

    useEffect(() => {
        setErrMsg('');
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const from = location.state?.from?.pathname || "/";

        try {
            const params = new URLSearchParams();
            params.append('mail', email);
            params.append('rol', selectedRole); // acá se pasa lo que seleccionó el usuario
            const response = await axios.post(`${CONTROLLER_URL}/cambiarrol`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            console.log('Respuesta:', response.data, ' ', selectedRole);

            try {
                const response = await fetch(`http://localhost:8080${CONTROLLER_URL}/email/${encodeURIComponent(email)}`);
                if (response.ok) {
                    const json = await response.json();
                    //console.log("Editar rol: ", json);

                    setAuth({ email: json.email, nombre: json.nombre, roles: json.rol, accessToken: auth.accessToken });
                } else {
                    console.error('Error al obtener los usuarios');
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }

            navigate("/linkPage", { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No responde el servidor ' + err);
            } else if (err.response?.status === 400) {
                setErrMsg('Error al cambiar rol');
            } else if (err.response?.status === 401) {
                setErrMsg('Sin autorización');
            } else {
                setErrMsg('Error al ingresar');
            }
        }
    };

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

            <form onSubmit={handleSubmit}>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="p-2 rounded border border-gray-300"
                >
                    {Object.entries(ROLES).map(([roleName, roleValue]) => (
                        <option key={roleName} value={roleName}>
                            {roleName}
                        </option>
                    ))}
                </select>

                <button type="submit" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Cambiar rol
                </button>
            </form>
        </section>
    );
};

export default EditarRol;
