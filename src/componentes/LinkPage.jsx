import { Link } from "react-router-dom"
import ExportarUsuarios from './ExportarUsuariosCSV.jsx';

const LinkPage = () => {

    return (
        <section>
            <h1>Links</h1>
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
