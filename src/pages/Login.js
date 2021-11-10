import React, { useEffect, useState } from 'react';
import { Row, Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../axios';
import { login } from '../features/userSlice';
import { Link, useNavigate } from "react-router-dom";
import Loading from '../components/Loading'
import Logo from '../components/Logo';
import { getLanguage } from '../features/generalSlice';
import text from '../constants/language'


const Login = () => {

    const language = useSelector(getLanguage);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/profile")
        }
    },[navigate])

    const onFinish = (values) => {
        if(!values.email){
            message.error(text[language].inValidEmail)
        } else if(!values.password){
            message.error(text[language].inValidPassword)
        } else {
            axios.post("/login", values)
            .then((res) => {
                dispatch(login(res.data))
                localStorage.setItem("token", res.data.token);
                setIsLoading(true)
                setTimeout(function () {
                    setIsLoading(false)
                    navigate("/profile");
                    message.success(text[language].successfullyLogin)
                }, 2500)
            }).catch(err => message.error(err.response.data.message))
        }
    };

    if(isLoading){
        return <Loading />
    }

    return (
        <div style={{ padding: 25 }}>
            <Row align="center" justify="center" style={{ marginTop: 30, marginBottom: 10 }}>
                <Logo />
            </Row>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item name="email" label={text[language].email} required requiredMark>
                    <Input type="email" />
                </Form.Item>
                <Form.Item name="password" label={text[language].password} required requiredMark>
                    <Input.Password type="password" />
                </Form.Item>
                <Form.Item label="" style={{ marginTop: 30, marginBottom: 10 }}>
                    <Button type="primary" htmlType="submit" block>{text[language].loginButton}</Button>
                </Form.Item>
                <Form.Item label="">
                    <Button type="link" htmlType="submit" block>
                        <Link to="/register">
                            {text[language].goToRegister}
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login
