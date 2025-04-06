import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : {};
    });

    useEffect(() => {
        if (auth?.accessToken) {
            localStorage.setItem("auth", JSON.stringify(auth));
            //console.log("Auth guardado:", JSON.parse(localStorage.getItem("auth")));
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
