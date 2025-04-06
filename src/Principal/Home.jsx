import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider.jsx";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Principal</h1>
            <br />
            <p>Has ingresado con éxito</p>
            <br />
            <Link to="/editarRoles">Editar roles</Link>
            <br />
            <Link to="/admin">Seccion admin</Link>
            <br />
            <Link to="/principal">área principal</Link>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Cerrar sesión</button>
            </div>
        </section>
    )
}

export default Home
