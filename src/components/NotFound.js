import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/home")
        } else {
            navigate("/login")
        }
    }, [])
    
    return (
        <div>dssdfds
            
        </div>
    )
}

export default NotFound
