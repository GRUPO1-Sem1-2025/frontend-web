import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const Missing = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Card
                title={<span style={{ fontSize: '2rem' }}>🚫 Página no encontrada</span>}
                subTitle="Oops! El enlace que buscaste no existe o fue eliminado"
                style={{ width: '90%', maxWidth: '500px', textAlign: 'center' }}
            >
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                    ¿Querés volver al inicio o ingresar con tu cuenta?
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Link to="/">
                        <Button label="Ir al menú" icon="pi pi-home" severity="primary" />
                    </Link>
                    <Link to="/ingresar">
                        <Button label="Ingresar" icon="pi pi-sign-in" severity="secondary" />
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Missing;