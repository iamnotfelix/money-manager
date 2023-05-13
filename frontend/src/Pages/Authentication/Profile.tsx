import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Components/Hooks/useAuth";
import { useEffect } from "react";

export const Profile = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/users/${auth.userId}`);
    })

    return (
        <div></div>
    );
}