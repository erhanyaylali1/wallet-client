import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/profile")
        } else {
            navigate("/login")
        }
    }, [navigate])
    
    return null
}

export default NotFound
