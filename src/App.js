import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound';
import { login, getIsUserLogged, setUserWallet, logout } from './features/userSlice';
import axios from './axios';
import './index.css';
import { getIsReload, setLanguage, setLoading } from './features/generalSlice';
import Loading from './components/Loading';

const App = () => {

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const isLogged = useSelector(getIsUserLogged);
    const isReload = useSelector(getIsReload)
    
    useEffect(() => {
        if(localStorage.getItem("token")){
            dispatch(setLoading(true))
            axios.get("/get-user-with-token", {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then((res) => {
                dispatch(login(res.data))
                setTimeout(function () {
                    setIsLoading(false)
                }, 2000)
            }).catch((err) => {
                setIsLoading(false)      
                localStorage.removeItem("token");
                dispatch(logout())   
                navigate("/login")
            })
        } else {
            setIsLoading(false)
        }
    }, [dispatch, isLogged])

    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get("/get-user-table-data", {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then((res) => {
                const response = {
                    data: res.data.result,
                    history: res.data.history.reverse(),
                    totalAssets: res.data.totalAssets
                }
                dispatch(setUserWallet(response))
            })
            .catch(err => console.log(err))
            .finally(() => dispatch(setLoading(false)))
        }
    }, [dispatch, isReload])

    useEffect(() => {
        let fetchData = setInterval(() => {
            if(localStorage.getItem("token")){
                axios.get("/get-user-table-data", {
                    headers: { Authorization: localStorage.getItem("token") }
                })
                .then((res) => {
                    const response = {
                        data: res.data.result,
                        history: res.data.history.reverse(),
                        totalAssets: res.data.totalAssets
                    }
                    dispatch(setUserWallet(response))
                })
                .catch(err => console.log(err))
                .finally(() => dispatch(setLoading(false)))
            }
        }, 10000);
        return () => {
            clearInterval(fetchData);
        }
    },[dispatch])

    useEffect(() => {
        if(localStorage.getItem("language")){
            dispatch(setLanguage(localStorage.getItem("language")))
        } else {
            dispatch(setLanguage("tr"))
        }
    })

    if(isLoading){
        return <Loading />
    }

    return(
        <div>
            <Navbar />
            <div style={{ paddingTop: 45, minHeight: '97vh' }}>
                <Routes>
                    <Route exact path="/home" element={<Wallet />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
