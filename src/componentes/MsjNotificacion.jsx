import { useRef } from 'react';
import { Toast } from 'primereact/toast';

export default function ExportarUsuarios({ message }) {
    const toast = useRef(null);

    const notiAdvertencia = (message) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Advertencia',
            detail: message,
            life: 6000
        });
    };

    const notiError = (message) => {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 6000
        });
    };

    const notiInfo = (message) => {
        toast.current.show({
            severity: 'info',
            summary: 'Información',
            detail: message,
            life: 6000
        });
    };

    const notiExito = (message) => {
        toast.current.show({
            severity: 'success',
            summary: 'Felicidades!',
            detail: message,
            life: 6000
        });
    };

    return (
        <Toast ref={toast} />
    );
};