import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth"

export const RequireAuth = (props: any) => {
    const { allowedRoles } = props;

    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles.find((role: string) => allowedRoles?.includes(role))
            ? <Outlet/>
            : auth?.token
                ? <Navigate to="/unauthorized" state={{from: location}} replace/>
                : <Navigate to="/login" state={{from: location}} replace/>
    );
}