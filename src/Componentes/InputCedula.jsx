
import React, { useState, useEffect } from "react";
import { InputMask } from "primereact/inputmask";
import { FloatLabel } from "primereact/floatlabel";
import { CEDULA_REGEX } from "../Configuraciones/Validaciones.js";

export default function InputCedula({
    value,
    onValidChange,
    onChange,
    styles = { width: "100%" },
    required = true
}) {
    const [inputValid, setInputValid] = useState(true);

    useEffect(() => {
        let isValid = true;
        if (value && CEDULA_REGEX) {
            const pattern = new RegExp(CEDULA_REGEX);
            isValid = pattern.test(value);
        }
        setInputValid(isValid);
        if (onValidChange) {
            onValidChange(isValid); // <-- Se notifica al componente padre
        }
    }, [value, CEDULA_REGEX, onValidChange]);

    return (
        <>
            <FloatLabel style={{ marginBottom: "1rem" }}>
                <InputMask
                    id="ci_input"
                    value={value}
                    onChange={onChange}
                    mask="9.999.999-9"
                    placeholder="9.999.999-9"
                    invalid={value && !inputValid}
                    aria-invalid={value && !inputValid}
                    style={styles}
                    required={required}
                />

                <label htmlFor="ci_input">Cédula</label>
            </FloatLabel>
        </>
    )
}