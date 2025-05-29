import { Dialog } from 'primereact/dialog';
import CargaMasivaLocalidades from '../../Componentes/CargaMasivaLocalidades.jsx';

export default function CargaMasivaLocalidadesModal({ visible, onHide }) {
	return (
		<Dialog header="Carga Masiva de localidades" visible={visible} style={{ width: '40vw' }} onHide={onHide}>
			<CargaMasivaLocalidades />
		</Dialog>
	);
}