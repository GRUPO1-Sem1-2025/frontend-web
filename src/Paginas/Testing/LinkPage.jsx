import { Link } from "react-router-dom";
import ExportarUsuarios from "../../Componentes/ExportarUsuariosCSV.jsx";
import useAuth from "../../Hooks/useAuth.jsx";
import NavBar from "../../Componentes/NavBar.jsx";
//PrimeReact
import { Card } from "primereact/card";

const LinkPage = () => {
  const { auth } = useAuth();

  return (
    <>
      <NavBar />
      <div className="rectangulo-centrado">
        <Card title="Pruebas de ruteo" className="cardCentrada">
          <br></br>
          <h3>Rutas públicas</h3>
          <Link to="/">Principal</Link>
          <br></br>
          <Link to="/registrarse">Registrarse</Link>
          <br></br>
          <Link to="/ingresar">Login</Link>
          <br></br>
          <Link to="/2FA">2FA</Link>
          <br></br>
          <Link to="/sinAutorizacion">Unauthorized</Link>
          <br></br>
          <Link to="/recuperarpassword">Recuperar Password</Link>
          <br></br>
          <Link to="/CambiarPassword">Cambiar Password</Link>
          <br></br>
          <Link to="/Venta/VentaPasaje">Venta de Pasaje</Link>
          <br></br>
          <Link to="/Venta/CompraExitosa">Compra Exitosa</Link>
          <br></br>
          <Link to="/Venta/Stripe">Venta de Pasaje (Stripe)</Link>
          <br></br>
          <Link to="/Venta/VentaPasaje">Venta de Pasaje</Link>
          <br></br>
        </Card>
      </div>
        </>
    )
}

export default LinkPage

