import { Dialog } from 'primereact/dialog';
import CargaMasivaUsuarios from '../../Componentes/CargaMasivaUsuarios.jsx';

export default function CargaMasivaModal({ visible, onHide }) {
	return (
		<Dialog header="Carga masiva de usuarios" visible={visible} style={{ width: '40vw' }} onHide={onHide}>
			<CargaMasivaUsuarios />
		</Dialog>
	);
}