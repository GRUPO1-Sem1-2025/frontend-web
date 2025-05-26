import { Dialog } from 'primereact/dialog';
import CargaMasivaAsientos from '../../Componentes/CargaMasivaAsientos.jsx';

export default function CargaMasivaAsientosModal({ visible, onHide }) {
    return (
        <Dialog header="Carga masiva de asientos" visible={visible} onHide={onHide} style={{ width: '40vw' }} modal>
            <CargaMasivaAsientos />
        </Dialog>
    );
}
