import { createContext, useState } from "react";
import {login,register} from "./services/auth.api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(null)
    
    const handleLogin = async (email, password)=> {
        setLoading(true)
        try {
            const response = await login(email, password)
            setUser(response.user)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (email, username, password)=> {
        setLoading(true)
        try {
            const response = await register(email, username, password)
            setUser(response.user)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (<AuthContext.Provider value={{ user, loading, handleLogin, handleRegister }}>
        {children}
    </AuthContext.Provider>
    )
}

