import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth, roles } = useAuth();
    const location = useLocation();

    return (
        Object.keys(roles).find(role => allowedRoles.includes(role))
            ? <Outlet />
            : auth?.accessToken
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;