import { Col, message, Row, Divider, Button, Select, Form, Tooltip } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from '../axios';
import { getIsReload, setReload } from '../features/generalSlice';
import AssetTable from '../components/AssetTable';
import avatar from '../assets/avatar.png';
import { capitalize } from '../utils/capitalize';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Option = Select.Option;

const Profile = () => {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [cryptos, setCryptos] = useState([]);
    const [funds, setFunds] = useState([]);
    const [fiat, setFiat] = useState([]);
    const [cryptosForSelect, setCryptoesForSelect] = useState([]);
    const [fundsForSelect, setFundsForSelect] = useState([]);
    const [fiatsForSelect, setFiatsForSelect] = useState([]);
    const navigate = useNavigate();
    const isReload = useSelector(getIsReload);
    const formRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get("/get-user-profile", {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                message.error(err?.response?.data?.message)
            })
            axios.get("/get-asset-user-has-not", {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then(res => {
                setCryptos(res.data.filter(el => el.id < 16))
                setFunds(res.data.filter(el => el.id >= 16 && el.id < 24))
                setFiat(res.data.filter(el => el.id >= 24))
            })
        } else {
            navigate("/login")
        }
    }, [navigate, isReload])

    const handleAddition = (values) => {
        
        let ids = [];

        if(values.selectedCryptos){
            ids = [...ids, ...values.selectedCryptos]
        }

        if(values.selectedFunds){
            ids = [...ids, ...values.selectedFunds]
        }

        if(values.selectedPyhsical){
            ids = [...ids, ...values.selectedPyhsical]
        }

        setLoading(true)
        axios.post("add-assets-to-user", { ids }, {
            headers: { Authorization: localStorage.getItem("token") }
        })
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
                        <img src={avatar} alt="user avatar" style={{ height: 60, width: 60, borderRadius: 50, color: '#333' }} />
                    </Col>
                    <Col style={{ color: '#333' }}>
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
                            name="selectedPyhsical"
                            label="Physical Investments"
                        >
                            <Select 
                                mode="multiple" 
                                placeholder="Please select investments physical investments you want to add"
                                value={fiatsForSelect}
                                onChange={(values) => setFiatsForSelect(values)}
                                showSearch={false}
                            >
                                {fiat.map((el, index) => (
                                    <Option value={el.id} key={index}>{el.name}</Option>
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
                                showSearch={false}
                            >
                                {funds.map((el, index) => (
                                    <Option value={el.id} key={index}>{el.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="selectedCryptos"
                            label="Crypto Moneys"
                        >
                            <Select 
                                mode="multiple" 
                                placeholder="Please select crypto moneys you want to add"
                                value={cryptosForSelect}
                                onChange={(values) => setCryptoesForSelect(values)}
                                showSearch={false}
                            >
                                {cryptos.map((el, index) => (
                                    <Option value={el.id} key={index}>{capitalize(el.name)}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        
                        <Form.Item label="" style={{ marginTop: 25, marginBottom: 10 }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                disabled={!cryptosForSelect.length && !fundsForSelect.length && !fiatsForSelect.length} 
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
