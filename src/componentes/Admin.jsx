import { Link } from "react-router-dom"

const Admin = () => {
    return (
        <section>
            <h1>Pagina de admins</h1>
            <br />
            <p>Felicidades eres admin</p>
            <div className="flexGrow">
                <Link to="/">Menú</Link>
            </div>
        </section>
    )
}

export default Admin
