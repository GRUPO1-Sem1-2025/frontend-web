import CambiarPassword from '../../Componentes/CambiarPassword.jsx';

import { Dialog } from 'primereact/dialog';

export default function CambiarPasswordModal({ visible, onHide, propEmail }) {
	return (
		<Dialog visible={visible} style={{ width: '27vw' }} onHide={onHide}>
			<CambiarPassword usaHeader={false} propEmail={propEmail} />
		</Dialog>
	);
}