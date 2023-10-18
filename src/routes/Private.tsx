import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/auth"

interface PrivateProps{
    children: React.ReactElement
}

const Private: React.FC<PrivateProps> = ({children}) =>{
    const { logged } = useAuth()

    if(!logged){
        return <Navigate to="/login" />
    }

    return children
}

export default Private