import { Col, message, Row, Divider, Button, Select, Form, Tooltip } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from '../axios';
import { getIsReload, setReload } from '../features/generalSlice';
import AssetTable from './AssetTable';
import avatar from '../assets/avatar.png';
import { capitalize } from '../utils/capitalize';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Option = Select.Option;

const Profile = () => {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [cryptos, setCryptos] = useState([]);
    const [funds, setFunds] = useState([]);
    const [cryptosForSelect, setCryptoesForSelect] = useState([]);
    const [fundsForSelect, setFundsForSelect] = useState([]);
    const navigate = useNavigate();
    const isReload = useSelector(getIsReload);
    const formRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get("/get-user-profile")
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                message.error(err?.response?.data?.message)
            })
            axios.get("/get-asset-user-has-not")
            .then(res => {
                setCryptos(res.data.filter(el => el.id < 16))
                setFunds(res.data.filter(el => el.id >= 16))
            })
        } else {
            navigate("/login")
        }
    }, [navigate, isReload])

    const handleAddition = (values) => {
        
        let ids = [];

        if(values.selectedCryptos && values.selectedFunds){
            ids = [...values.selectedCryptos, ...values.selectedFunds];
        } else if (values.selectedCryptos) {
            ids = values.selectedCryptos;
        } else if (values.selectedFunds) {
            ids = values.selectedFunds;
        } else {
            message.error("Please select at least one asset!");
            return
        }   
        setLoading(true)
        axios.post("add-assets-to-user", { ids })
        .then(res => {
            message.success(res.data);
            formRef.current.resetFields();
            setTimeout(function (){
                dispatch(setReload())
            }, 600); 
        })
        .catch(err => console.log(err.response))
        .finally(() => setLoading(false))
    }

    if(user === null) {
        return null;
    } else {
        return (
            <Col style={{ padding: "35px" }}>
                <Row style={{ alignItems: 'center', paddingLeft: 10, fontFamily: 'inherit', fontSize: 30, fontWeight: 400, marginBottom: 40 }}>
                    <Col style={{ marginRight: 15 }}>
                        <img src={avatar} alt="user avatar" style={{ height: 60, width: 60, borderRadius: 50 }} />
                    </Col>
                    <Col>
                        { user.name }
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <Divider orientation="left">Assets</Divider>
                    </Col>
                    <Col span={1} />
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip placement="left" title="Use '.' for decimal, Don't use anything for thousands. e.g. Asset: 42363.53">
                            <ExclamationCircleOutlined size={25} />
                        </Tooltip>
                    </Col>
                </Row>
                <Col>
                    {user.Assets.length > 0 ? (
                        <AssetTable assets={user.Assets} />
                    ):(
                        <div>
                            You Have No Asset.
                        </div>
                    )}
                </Col>
                <Divider orientation="right" style={{ marginTop: 20 }}>Add Assets</Divider>
                <Row>
                    <Form
                        ref={formRef}
                        style={{ width: '100%' }}
                        layout="horizontal"
                        onFinish={handleAddition}
                    >
                        <Form.Item
                            name="selectedCryptos"
                            label="Crypto Moneys"
                        >
                            <Select 
                                mode="multiple" 
                                placeholder="Please select crypto moneys you want to add"
                                value={cryptosForSelect}
                                onChange={(values) => setCryptoesForSelect(values)}
                            >
                                {cryptos.map((el, index) => (
                                    <Option value={el.id} key={index}>{capitalize(el.name)}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="selectedFunds"
                            label="Investments Funds"
                        >
                            <Select 
                                mode="multiple" 
                                placeholder="Please select investments funds you want to add"
                                value={fundsForSelect}
                                onChange={(values) => setFundsForSelect(values)}
                            >
                                {funds.map((el, index) => (
                                    <Option value={el.id} key={index}>{el.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="" style={{ marginTop: 25, marginBottom: 10 }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                disabled={!cryptosForSelect.length && !fundsForSelect.length} 
                                loading={loading}
                            >
                                Add
                            </Button>
                        </Form.Item>
                    </Form>
                </Row>
            </Col>
        )
    }
}

export default Profile
