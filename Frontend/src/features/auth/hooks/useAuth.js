import { useContext, useEffect} from "react";
import { AuthContext } from "../auth.context";
import { login , register , getMe , logout } from "../services/auth.api";

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user , setUser , loading ,setLoading} = context 
    
    const handleLogin = async ({email, password}) => {
        setLoading(true)
        try{
            const data = await login({email, password})
            setUser(data.user) 
        }
        catch(err){
            console.error('file(useAuth.js) Error occurred while logging in:', err);
            throw err; 
        }
        finally{
            setLoading(false)
        }
    }


    const handleRegister = async ({username, email, password}) => {
        setLoading(true)
        try{
            const data = await register({username, email, password})
            setUser(data.user)
        }
        catch(err){
            console.error('file(useAuth.js) Error occurred while registering:', err);
            throw err;
        }
        finally{
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
            localStorage.clear();
        }
        catch(err){
            console.error('file(useAuth.js)  Error occurred while logging out:', err);
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            }
            catch (err) {
                console.error('User is not logged in:', err)
                setUser(null)
            }
            finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return {user, loading, handleRegister, handleLogin, handleLogout}
}