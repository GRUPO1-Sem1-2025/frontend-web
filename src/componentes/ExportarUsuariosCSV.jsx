import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

const headers = [
    { label: "Nombre", key: "nombre" },
    { label: "Email", key: "email" },
    { label: "Activo", key: "estado" }
];

const ExportarUsuarios = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/usuarios`);
                if (response.ok) {
                    const json = await response.json();
                    setData(json);
                } else {
                    console.error('Error al obtener los usuarios');
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
        };

        fetchData();
    }, []);

    return (
        data.length > 0 ? (
            <CSVLink data={data} headers={headers} filename="usuarios.csv">
                Exportar usuarios
            </CSVLink>
        ) : (
            <p>Cargando usuarios...</p>
        )
    );
};

export default ExportarUsuarios;
