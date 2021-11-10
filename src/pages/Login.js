import React, { useEffect, useState } from 'react';
import { Row, Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from '../axios';
import { login } from '../features/userSlice';
import { Link, useNavigate } from "react-router-dom";
import Loading from '../components/Loading'
import Logo from '../components/Logo';


const Login = () => {

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
            message.error("Please Enter Your Email Address!")
        } else if(!values.password){
            message.error("Please Enter Your Password!")
        } else {
            axios.post("/login", values)
            .then((res) => {
                dispatch(login(res.data))
                localStorage.setItem("token", res.data.token);
                setIsLoading(true)
                setTimeout(function () {
                    setIsLoading(false)
                    navigate("/profile");
                    message.success("Successfully Logged In.")
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
                <Form.Item name="email" label="Email" required requiredMark>
                    <Input type="email" />
                </Form.Item>
                <Form.Item name="password" label="Password" required requiredMark>
                    <Input.Password type="password" />
                </Form.Item>
                <Form.Item label="" style={{ marginTop: 30, marginBottom: 10 }}>
                    <Button type="primary" htmlType="submit" block>Login</Button>
                </Form.Item>
                <Form.Item label="">
                    <Button type="link" htmlType="submit" block>
                        <Link to="/register">
                            You don't have an account? Register quickly.
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login
