import { createContext, useState } from "react";
import { useRolesReducer } from "../hooks/RoleManager";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    //accessToken, email, id
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(true);
    const [roles, dispatchRoles] = useRolesReducer();
    const [userData, setUserData] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, roles, dispatchRoles, userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;