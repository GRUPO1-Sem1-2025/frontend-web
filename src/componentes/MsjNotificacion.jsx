import { useRef } from 'react';
import { Toast } from 'primereact/toast';

export default function Noti({ message, duracion}) {
    const toast = useRef(null);

    const notiAdvertencia = (message, duracion = 6000) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Advertencia',
            detail: message,
            life: duracion
        });
    };
    
    const notiError = (message, duracion = 6000) => {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: duracion
        });
    };

    const notiInfo = (message, duracion = 6000) => {
        toast.current.show({
            severity: 'info',
            summary: 'Información',
            detail: message,
            life: duracion
        });
    };

    const notiExito = (message, duracion = 6000) => {
        toast.current.show({
            severity: 'success',
            summary: 'Felicidades!',
            detail: message,
            life: duracion
        });
    };

    return (
        <Toast ref={toast} />
    );
};