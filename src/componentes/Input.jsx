import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

const Input2 = ({
    titulo,
    value,
    onChange,
    descripcion,
    required = false,
    regex,
    styles = { width: "100%" },
    onValidChange,
    permitirTeclas
}) => {
    const inputRef = useRef();
    const [inputValid, setInputValid] = useState(true);
    const [inputFocus, setUserFocus] = useState(false);

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
            onValidChange(isValid); // <-- Se notifica al componente padre
        }
    }, [value, regex, onValidChange]);

    return (
        <>
            <FloatLabel style={{ marginBottom: "1rem" }}>
                <label htmlFor="inputComponente">
                    {titulo}
                </label>
                <InputText
                    type="text"
                    id="inputComponente"
                    ref={inputRef}
                    autoComplete="off"
                    onChange={onChange}
                    value={value}
                    required={required}
                    invalid={value && !inputValid}
                    aria-invalid={value && !inputValid}
                    aria-describedby="inputNote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    style={styles}
                    keyfilter={permitirTeclas}
                />

                {descripcion && (
                    <small id="inputNote" className={inputFocus && value && !inputValid ? "instructions" : "offscreen"}>
                        <ul style={{background: "#c6eefc", borderRadius: "0.5rem", marginTop: "0.30rem"}}>
                            {descripcion.split('\n').map((linea, idx) => (
                                <li key={idx}>{linea}</li>
                            ))}
                        </ul>
                    </small>
                )}
            </FloatLabel>
        </>
    );
};

export default Input2;