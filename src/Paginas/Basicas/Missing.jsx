import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>No se encontro la página que buscaba</p>
            <Link to="/">Ir al menú</Link>
            <br />
            <Link to="/ingresar">Ingresar con mi cuenta</Link>
        </article>
    )
}

export default Missing
