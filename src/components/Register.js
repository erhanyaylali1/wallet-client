import React, { useEffect } from 'react'
import eWallet from '../assets/eWalleT.png';
import { Col, Row, Typography, Form, Input, Button, Select, message } from 'antd'
import { cryptoNames, funds } from '../constants/wallets'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import axios from '../axios';
import { capitalize } from '../utils/capitalize';

const { Title } = Typography;
const { Option } = Select;

const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/home")
        }
    },[navigate])

    const onFinish = (values) => {
        if(!values.name){
            message.error("Please Enter Your Name and Surname!")
        } else if(!values.email){
            message.error("Please Enter Your Email Address!")
        } else if(!values.password){
            message.error("Please Enter Your Password!")
        } else {
            if(!values.selectedCryptos){
                values.selectedCryptos = [];
            }
            if(!values.selectedFunds){
                values.selectedFunds = [];
            }
            message.loading("User is Registering...")
            axios.post('/register', values)
            .then((res) => {
                message.success("Successfully Logged In.")
                dispatch(login(res.data))
                localStorage.setItem("token", res.data.token);
                navigate("/home");
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
                <Form.Item name="name" label="Name Surname" required requiredMark>
                    <Input type="text" />
                </Form.Item>
                <Form.Item name="email" label="Email" required requiredMark>
                    <Input type="email" />
                </Form.Item>
                <Form.Item name="password" label="Password" required requiredMark>
                    <Input.Password type="password" />
                </Form.Item>
                <Form.Item
                    name="selectedCryptos"
                    label="Crypto Moneys"
                >
                    <Select mode="multiple" placeholder="Please select crypto moneys you have">
                        {cryptoNames.map((el, index) => (
                            <Option value={el} key={index}>{capitalize(el)}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="selectedFunds"
                    label="Investments Funds"
                >
                    <Select mode="multiple" placeholder="Please select investments funds you have">
                        {funds.map((el, index) => (
                            <Option value={el[0]} key={index}>{el[1]}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="" style={{ marginTop: 40, marginBottom: 10 }}>
                    <Button type="primary" htmlType="submit" block>Register</Button>
                </Form.Item>
                <Form.Item label="">
                    <Button type="link" htmlType="submit" block>
                        <Link to="/login">
                            Already have an account? Login quickly.
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register
