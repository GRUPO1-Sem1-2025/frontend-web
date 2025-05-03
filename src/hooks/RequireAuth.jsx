import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth.jsx";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (auth?.roles == null) {
        console.error("AllowedRoles role es NULL o UNDEFINED:", auth?.roles);
    }

    //console.log("Auth en RequireAuth:", auth);
    //console.log("AllowedRoles:", allowedRoles);
    const rolesArray = Array.isArray(auth.roles) ? auth.roles : [auth.roles];

    return (
        rolesArray.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.email
                ? <Navigate to="sinAutorizacion" state={{ from: location }} replace />
                : <Navigate to="/ingresar" state={{ from: location }} replace />
    );
}

export default RequireAuth;