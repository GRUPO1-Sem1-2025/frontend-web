import Noti from '../Componentes/MsjNotificacion.jsx';

import { useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';

import axios, { URL_ASIENTOSCONTROLLER } from '../Configuraciones/axios.js';

const SubirArchivo = () => {
    const fileUploadRef = useRef(null);
    const toastRef = useRef();
    const [archivo, setArchivo] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSelect = (e) => {
        const file = e.files[0];
        setArchivo(file);
    };

    const onClear = () => {
        setArchivo(null);
    };

    const subirArchivo = async () => {
        if (!archivo || loading) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", archivo);

        try {
            const response = await axios.post(`${URL_ASIENTOSCONTROLLER}/crearAsientosMasivos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toastRef.current.notiExito("Archivo subido con éxito");
            //console.log("Archivo subido con éxito:", response.data);
        } catch (error) {
            toastRef.current.notiError("Error al subir archivo " + error.message);
            console.error("Error al subir archivo:", error.response?.data?.mensaje || error.message);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setArchivo(null);
                fileUploadRef.current.clear(); // limpiar selector
            }, 2000); // evita doble submit rápido
        }
    };

    return (
        <Card style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <Noti ref={toastRef} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem"
                }}
            >                
            
            <FileUpload
                    ref={fileUploadRef}
                    name="file"
                    mode="basic"
                    accept=".csv,.xlsx,.txt"
                    maxFileSize={5000000}
                    chooseLabel="Seleccionar archivo"
                    customUpload
                    uploadHandler={subirArchivo}
                    auto={false}
                    multiple={false}
                    onSelect={onSelect}
                    onClear={onClear}
                    emptyTemplate={<p className="m-0" style={{ padding: "0.7rem" }}>Sube tus archivos aquí</p>}
                />

                <Button
                    label="Subir archivo"
                    onClick={subirArchivo}
                    disabled={!archivo}
                    loading={loading}
                />
            </div>
        </Card>
    );
};

export default SubirArchivo;