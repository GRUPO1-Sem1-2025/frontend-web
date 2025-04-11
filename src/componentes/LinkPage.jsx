import { Link } from "react-router-dom"
import ExportarUsuarios from './ExportarUsuariosCSV.jsx';
import useAuth from "../hooks/useAuth.jsx";

const LinkPage = () => {
    const { auth } = useAuth();

    return (
        <section>
            <h1>Bienvenido, {auth.nombre} </h1>
            <br />
            <h2>Public</h2>
            <Link to="/ingresar">Login</Link>
            <Link to="/registrarse">Registrarse</Link>
            <ExportarUsuarios />

            <br />
            <h2>Private</h2>
            <Link to="/">Principal</Link>
            <Link to="/editarRoles">Editar roles</Link>
            <Link to="/admin">Sección admin</Link>
        </section>
    )
}

export default LinkPage
