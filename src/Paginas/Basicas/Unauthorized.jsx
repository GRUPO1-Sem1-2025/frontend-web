import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>Sin autorización para acceder al sitio</h1>
            <br />
            <p>No tienes acceso para hacer esto</p>
            <div className="flexGrow">
                <button onClick={goBack}>Volver</button>
            </div>
        </section>
    )
}

export default Unauthorized
