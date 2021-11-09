import { Col, Row, Button, Tooltip, Input, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { EditOutlined, CheckOutlined , DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import axios from '../axios';
import { useDispatch } from 'react-redux';
import { setReload } from '../features/generalSlice';


function EachAsset({ asset }) {

    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setInputValue(asset.quantity)
    }, [asset])

    const handleOk = async () => {
        if(/^[0-9]+(\.)?[0-9]*$/.test(inputValue)){
            axios.post("/update-user-asset", {
                    id: asset.id,
                    quantity: inputValue
            })
            .then(res => {
                message.success(res.data);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsEdit(false)
                setIsModalVisible(false);
                dispatch(setReload())
            })
        } else {
            message.error("Enter Valid Quantity!");
            setIsModalVisible(false);
            setInputValue(asset.quantity)
        }
    }

    const handleDelete = async () => {
        axios.post("/delete-user-asset", {
            id: asset.id,
        })
        .then(res => {
            message.success(res.data);
        })
        .catch(err => console.log(err))
        .finally(() => {
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
                    <Modal  title="Save Asset" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>                
                        <React.Fragment>
                            <p>You are editing {asset.name}</p>
                            <p>From: {asset.quantity} </p>
                            <p>To: {inputValue}</p>
                        </React.Fragment>
                    </Modal>
                )
            } else if (modalType === 2) {
                return (
                    <Modal title="Delete Asset" visible={isModalVisible} onOk={handleDelete} onCancel={() => setIsModalVisible(false)}>                
                        <React.Fragment>
                            <p>You are deleting {asset.name}</p>
                        </React.Fragment>
                    </Modal>
                )
            }
        } else {
            return null
        }
    }

    return (
        <Row style={{ marginTop: 20 }}>
            <Col span={6} style={{ fontSize: 17 }}>
                <Tooltip title={asset.name}>
                    { asset.short }
                </Tooltip>
            </Col>
            <Col span={10} className="asset-text">
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
                        <Tooltip title="Cancel">
                            <Button type="link" icon={<CloseOutlined className="asset-icon" />} onClick={() => setIsEdit(false)}/>
                        </Tooltip>
                        <Tooltip title="Save">
                            <Button type="link" icon={<CheckOutlined className="asset-icon" />} onClick={() => handleModalOpen(1)}/>
                        </Tooltip>
                    </React.Fragment>
                ):(
                    <Tooltip title="Edit">
                        <Button type="link" icon={<EditOutlined className="asset-icon" />} onClick={() => setIsEdit(true)}/>
                    </Tooltip>
                )}
                 <Tooltip title="Delete">
                    <Button type="link" icon={<DeleteOutlined className="asset-icon" />} onClick={() => handleModalOpen(2)}/>
                </Tooltip>
            </Col>
            {renderModalContent()}
        </Row>
    )
}

export default EachAsset
