import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Register from './components/Register';
import Wallet from './components/Wallet';
import { login, getIsUserLogged, setUserWallet } from './features/userSlice';
import axios from './axios';
import './index.css';
import NotFound from './components/NotFound';
import { getIsReload, setLoading } from './features/generalSlice';

const App = () => {

    const dispatch = useDispatch();
    const isLogged = useSelector(getIsUserLogged);
    const isReload = useSelector(getIsReload)
    
    useEffect(() => {
        if(localStorage.getItem("token")){
            console.log("1.")
            dispatch(setLoading(true))
            axios.get("/get-user-with-token")
            .then((res) => {
                dispatch(login(res.data))
            }).catch((err) => console.log(err))
        }
    }, [dispatch, isLogged])

    useEffect(() => {
        if(localStorage.getItem("token")){
            console.log("2.")
            axios.get("/get-user-table-data")
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
                console.log("3.")
                axios.get("/get-user-table-data")
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
