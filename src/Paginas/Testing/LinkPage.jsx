import { Link } from "react-router-dom"
import useAuth from "../../Hooks/useAuth.jsx";
import NavBar from '../../Componentes/NavBar.jsx';
//PrimeReact
import { Card } from 'primereact/card';

const LinkPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBar />
            <div className='rectangulo-centrado'>
                <Card title="Pruebas de ruteo" className="cardCentrada">
                    <br></br>
                    <h3>Rutas públicas</h3>
                    <Link to="/">Principal</Link><br></br>
                    <Link to="/ingresar">Login</Link><br></br>
                    <Link to="/registrarse">Registrarse</Link><br></br>
                    {/* <ExportarUsuarios /> */}

                    <br></br>
                    <h3>Rutas privadas</h3>
                    <Link to="/Dashboard">Dashboard</Link><br></br>
                    <Link to="/Omnibus/AltaOmibus">Alta Omnibus</Link><br></br>
                    <Link to="/Omnibus/ListadoOmnibus">Listado Omnibus</Link><br></br>
                    <Link to="/Viaje/AltaViaje">Alta Viaje</Link><br></br>
                    <Link to="/Usuarios/AltaUsuario">Alta usuario</Link><br></br>

                </Card>
            </div>
        </>
    )
}

export default LinkPage