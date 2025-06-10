import { useEffect, useRef, useState, useId } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

const Input2 = ({
    id, // 👈 nuevo prop
    titulo,
    value,
    onChange,
    descripcion,
    required = false,
    regex,
    styles = { width: "100%" },
    onValidChange,
    permitirTeclas,
    type = "text"
}) => {
    const inputRef = useRef();
    const [inputValid, setInputValid] = useState(true);
    const [inputFocus, setUserFocus] = useState(false);
    const autoId = useId(); // 👈 ID único generado automáticamente

    const inputId = id || autoId; // Usa el id pasado o genera uno

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        let isValid = true;
        if (value && regex) {
            const pattern = new RegExp(regex);
            isValid = pattern.test(value);
        }
        setInputValid(isValid);
        if (onValidChange) {
            onValidChange(isValid);
        }
    }, [value, regex, onValidChange]);

    return (
        <FloatLabel style={{ marginBottom: "1rem" }}>
            <label htmlFor={inputId}>{titulo}</label>
            <InputText
                id={inputId}
                type={type}
                ref={inputRef}
                autoComplete="off"
                onChange={onChange}
                value={value}
                required={required}
                invalid={value && !inputValid}
                aria-invalid={value && !inputValid}
                aria-describedby={descripcion ? `${inputId}-note` : undefined}
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                style={styles}
                keyfilter={permitirTeclas}
            />
            {descripcion && (
                <small
                    id={`${inputId}-note`}
                    className={inputFocus && value && !inputValid ? "instructions" : "offscreen"}
                >
                    <ul style={{ background: "#c6eefc", borderRadius: "0.5rem", marginTop: "0.30rem" }}>
                        {descripcion.split('\n').map((linea, idx) => (
                            <li key={idx}>{linea}</li>
                        ))}
                    </ul>
                </small>
            )}
        </FloatLabel>
    );
};

export default Input2;
