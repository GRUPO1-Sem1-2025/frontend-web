// Noti.js
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Toast } from 'primereact/toast';

const Noti = forwardRef((props, ref) => {
    const toast = useRef(null);

    useImperativeHandle(ref, () => ({
        notiAdvertencia(message, duracion = 6000) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: message,
                life: duracion
            });
        },
        notiError(message, duracion = 6000) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: duracion
            });
        },
        notiInfo(message, duracion = 6000) {
            toast.current.show({
                severity: 'info',
                summary: 'Información',
                detail: message,
                life: duracion
            });
        },
        notiExito(message, duracion = 6000) {
            toast.current.show({
                severity: 'success',
                summary: 'Felicidades!',
                detail: message,
                life: duracion
            });
        }
    }));

    return <Toast ref={toast} />;
});

export default Noti;