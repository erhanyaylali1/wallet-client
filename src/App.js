import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound';
import { login, getIsUserLogged, setUserWallet } from './features/userSlice';
import axios from './axios';
import './index.css';
import { getIsReload, setLoading } from './features/generalSlice';
import Loading from './components/Loading';

const App = () => {

    const [isLoading, setIsLoading] = useState(true);
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
                console.log(err)
                setIsLoading(false)            
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

    if(isLoading){
        return <Loading />
    }

    return(
        <BrowserRouter>
            <Navbar />
            <div style={{ paddingTop: 45 }}>
                <Routes>
                    <Route exact path="/home" element={<Wallet />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
