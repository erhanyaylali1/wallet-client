import React, { useEffect, useState } from 'react'
import { Row, Form, Input, Button, Select, message } from 'antd'
import { cryptoNames, funds, physicals } from '../constants/wallets'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/userSlice';
import axios from '../axios';
import { capitalize } from '../utils/capitalize';
import Logo from '../components/Logo';
import Loading from '../components/Loading';
import { getLanguage } from '../features/generalSlice';
import text from '../constants/language'

const { Option } = Select;

const Register = () => {

    const language = useSelector(getLanguage);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/home")
        }
    },[navigate])

    const onFinish = (values) => {
        if(!values.name){
            message.error(text[language].invalidName)
        } else if(!values.email){
            message.error(text[language].inValidEmail)
        } else if(!values.password){
            message.error(text[language].inValidPassword)
        } else {
            if(!values.selectedCryptos){
                values.selectedCryptos = [];
            }
            if(!values.selectedFunds){
                values.selectedFunds = [];
            }
            if(!values.selectedPhysical){
                values.selectedPhysical = [];
            }
            axios.post('/register', values)
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
            <Row align="bottom" justify="center" style={{ marginTop: 10, marginBottom: 10 }}>
                <Logo />
            </Row>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item name="name" label={text[language].name} required requiredMark>
                    <Input type="text" />
                </Form.Item>
                <Form.Item name="email" label={text[language].email} required requiredMark>
                    <Input type="email" />
                </Form.Item>
                <Form.Item name="password" label={text[language].password} required requiredMark>
                    <Input.Password type="password" />
                </Form.Item>
                <Form.Item
                    name="selectedPhysical"
                    label={text[language].physicalTitle}
                >
                    <Select mode="multiple" placeholder={text[language].selectPhysical} showSearch={false}>
                        {physicals.map((el, index) => (
                            <Option value={el} key={index}>{el}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="selectedFunds"
                    label={text[language].crpytoTitle}
                >
                    <Select mode="multiple" placeholder={text[language].selectCrypto} showSearch={false}>
                        {funds.map((el, index) => (
                            <Option value={el[0]} key={index}>{el[1]}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="selectedCryptos"
                    label={text[language].fundTitle}
                >
                    <Select mode="multiple" placeholder={text[language].selectFund} showSearch={false}>
                        {cryptoNames.map((el, index) => (
                            <Option value={el} key={index}>{capitalize(el)}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="" style={{ marginTop: 40, marginBottom: 10 }}>
                    <Button type="primary" htmlType="submit" block>{text[language].registerButton}</Button>
                </Form.Item>
                <Form.Item label="">
                    <Button type="link" htmlType="submit" block>
                        <Link to="/login">
                            {text[language].goToLogin}
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register
