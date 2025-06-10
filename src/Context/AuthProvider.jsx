import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("auth");
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);

            // Verificar expiración si existe
            const now = Date.now();
            if (parsed.expira && new Date(parsed.expira).getTime() < now) {
                console.warn("Token expirado, limpiando auth");
                localStorage.removeItem("auth");
                return null;
            }

            return parsed;
        } catch (error) {
            console.error("Error al parsear auth desde localStorage:", error);
            localStorage.removeItem("auth");
            return null;
        }
    });

    // Sincronizar localStorage cada vez que cambia auth
    useEffect(() => {
        if (auth?.token) {
            localStorage.setItem("auth", JSON.stringify(auth));
        } else {
            localStorage.removeItem("auth");
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
