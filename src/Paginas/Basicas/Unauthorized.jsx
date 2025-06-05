import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Card
                title={<span style={{ fontSize: '2rem' }}>🔒 Acceso denegado</span>}
                subTitle="No tienes permisos para ver esta sección"
                style={{ width: '90%', maxWidth: '500px', textAlign: 'center' }}
            >
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Si creés que esto es un error, comunicate con el administrador del sistema.
                </p>
                <Button label="Volver" icon="pi pi-arrow-left" onClick={goBack} />
            </Card>
        </div>
    );
};

export default Unauthorized;