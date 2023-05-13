import { createContext, useState } from "react";
import { Auth } from "../../Models/Auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = (props: any) => {
    const [auth, setAuth] = useState<Auth | null>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;