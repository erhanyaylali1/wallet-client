import React, { useEffect } from 'react';
import eWallet from '../assets/eWalleT.png';
import { Col, Row, Typography, Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from '../axios';
import { login } from '../features/userSlice';
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {

    const dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/home")
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
                message.success("Successfully Logged In.")
                dispatch(login(res.data))
                localStorage.setItem("token", res.data.token);
                navigate("/profile");
            }).catch(err => message.error(err.response.data.message))
        }
    };

    return (
        <div style={{ padding: 25 }}>
            <Row align="bottom" justify="center" style={{ marginTop: 10, marginBottom: 40 }}>
                <Col>
                    <img src={eWallet} style={{ height: 80, marginRight: 30 }} alt="eWallet Logo" />
                </Col>
                <Col>
                    <Title level={2}>eWallet</Title>
                </Col>
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
