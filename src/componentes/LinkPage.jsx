import { Link } from "react-router-dom"

const LinkPage = () => {
    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <Link to="ingresar">Login</Link>
            <Link to="registrarse">Registrarse</Link>
            <br />
            <h2>Private</h2>
            <Link to="/">Principal</Link>
            <Link to="/editarRoles">Editar roles</Link>
            <Link to="/admin">Sección admins</Link>
        </section>
    )
}

export default LinkPage
