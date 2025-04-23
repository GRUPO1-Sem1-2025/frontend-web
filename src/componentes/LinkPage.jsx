import { Link } from "react-router-dom"
import ExportarUsuarios from './ExportarUsuariosCSV.jsx';
import useAuth from "../hooks/useAuth.jsx";
//PrimeReact
import { Card } from 'primereact/card';

const LinkPage = () => {
    const { auth } = useAuth();

    return (
            <Card title="Pruebas de ruteo" className="cardCentrada">
                <br></br>
                <h3>Rutas públicas</h3>
                <Link to="/ingresar">Login</Link><br></br>
                <Link to="/registrarse">Registrarse</Link><br></br>
                {/* <ExportarUsuarios /> */}

                <br></br>
                <h3>Rutas privadas</h3>
                <Link to="/">Principal</Link><br></br>
                <Link to="/editarRoles">Editar roles</Link><br></br>
                <Link to="/admin">Sección admin</Link><br></br>
            </Card>
    )
}

export default LinkPage
