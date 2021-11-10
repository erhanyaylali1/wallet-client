import { Col, Row, Button, Tooltip, Input, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { EditOutlined, CheckOutlined , DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import axios from '../axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReload, getLanguage } from '../features/generalSlice';
import text from '../constants/language'
import { Animated } from "react-animated-css";

function EachAsset({ asset, even }) {

    const dispatch = useDispatch();
    const language = useSelector(getLanguage);
    const [isEdit, setIsEdit] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setInputValue(asset.quantity !== "0" ? asset.quantity:"")
    }, [asset])

    const handleOk = async () => {
        if(/^[0-9]+(\.)?[0-9]*$/.test(inputValue)){
            axios.post("/update-user-asset", {
                    id: asset.id,
                    quantity: inputValue
            }, {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then(res => {
                message.success(text[language].messageUpdateAsset);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsEdit(false)
                setIsModalVisible(false);
                dispatch(setReload())
            })
        } else {
            message.error(text[language].messageInvalidInput);
            setIsModalVisible(false);
            setInputValue(asset.quantity !== 0 ? asset.quantity:"")
        }
    }

    const handleDelete = async () => {
        axios.post("/delete-user-asset", {
            id: asset.id,
        }, {
            headers: { Authorization: localStorage.getItem("token") }
        })
        .then(res => {
            message.success(text[language].messageDeleteAsset);
        })
        .catch(err => console.log(err))
        .finally(() => {
            setIsVisible(false)
            setIsEdit(false)
            setIsModalVisible(false);
            dispatch(setReload())
        })
    }

    const handleModalOpen = (type) => {
        setModalType(type);
        setIsModalVisible(true)
    }

    const renderModalContent = () => {
        if(modalType){
            if(modalType === 1) {
                return (
                    <Modal 
                        title={text[language].editModaTitle} 
                        visible={isModalVisible} 
                        onOk={handleOk} 
                        onCancel={() => setIsModalVisible(false)}
                        okText={text[language].okText}
                        cancelText={text[language].cancelText}
                    >                
                        <React.Fragment>
                            <p>{text[language].editModalContent1} {asset.name}</p>
                            <p>{text[language].editModalContent2} {asset.quantity} </p>
                            <p>{text[language].editModalContent3} {inputValue}</p>
                        </React.Fragment>
                    </Modal>
                )
            } else if (modalType === 2) {
                return (
                    <Modal 
                        title={text[language].deleteModalTitle} 
                        visible={isModalVisible} 
                        onOk={handleDelete} 
                        onCancel={() => setIsModalVisible(false)}
                        okText={text[language].okText}
                        cancelText={text[language].cancelText}
                    >                
                        <React.Fragment>
                            <p>{text[language].deleteModalContent} {asset.name}</p>
                        </React.Fragment>
                    </Modal>
                )
            }
        } else {
            return null
        }
    }

    return (
        
        <div style={{ backgroundColor: even ? '#efefef':'white', padding: '5px 20px' }} className="eachAssetRow">
            <Row>
                <Col span={6} style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={asset.name}>
                        { asset.short }
                    </Tooltip>
                </Col>
                <Col span={10} className="asset-text" style={{ display: 'flex', alignItems: 'center' }}>
                    { isEdit ? (
                        <Input 
                            size="medium" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)} 
                        />
                    ):(
                        <span> { asset.quantity }</span>
                    )}
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isEdit ? (
                        <React.Fragment>
                            <Tooltip title={text[language].cancelButtonToolTip}>
                                <Button type="link" icon={<CloseOutlined className="asset-icon" />} onClick={() => setIsEdit(false)}/>
                            </Tooltip>
                            <Tooltip title={text[language].saveButtonToolTip}>
                                <Button type="link" icon={<CheckOutlined className="asset-icon" />} onClick={() => handleModalOpen(1)}/>
                            </Tooltip>
                        </React.Fragment>
                    ):(
                        <Tooltip title={text[language].editButtonToolTip}>
                            <Button type="link" icon={<EditOutlined className="asset-icon" />} onClick={() => setIsEdit(true)}/>
                        </Tooltip>
                    )}
                    <Tooltip title={text[language].deleteButtonToolTip}>
                        <Button type="link" icon={<DeleteOutlined className="asset-icon" />} onClick={() => handleModalOpen(2)}/>
                    </Tooltip>
                </Col>
                {renderModalContent()}
            </Row>
        </div>
    )
}

export default EachAsset
