import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("auth");
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            const now = Date.now();

            // Si hay fecha de expiración y ya expiró
            if (parsed.expira && new Date(parsed.expira).getTime() < now) {
                localStorage.removeItem("auth");
                return null;
            }

            return parsed;
        } catch {
            localStorage.removeItem("auth");
            return null;
        }
    });

    useEffect(() => {
        if (auth?.accessToken) {
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