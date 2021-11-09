import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';

const Home = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("token")) {
            navigate("/login")
        }
    }, [navigate])

    return (
        <div>
            HOME
        </div>
    )
}

export default Home
