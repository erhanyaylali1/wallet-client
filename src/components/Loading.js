import { Col, Row } from 'antd';
import React from 'react'
import { Messaging } from "react-cssfx-loading";
import { Wave } from "react-animated-text";
import { Animated } from 'react-animated-css';

const Loading = () => {
    return (
        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: '#fff', zIndex: 100,
                transition: 'display 0.5s eas'
            }}>
                <Col style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center' }}>
                    <Row justify="center" align="middle" style={{ marginBottom: 0, fontSize: 25, fontWeight: 500, color: '#1890ff' }}> 
                        <Wave text={"eWallet"} effect="fadeOut" delay={0.3} effectDuration={2} />
                    </Row>
                    <Row justify="center" style={{ marginTop: 30 }}>
                        <Messaging color="#1890ff" width="7px" height="7px" />
                    </Row>
                    <Row style={{ position: 'absolute', bottom: '4%', fontWeight: '500' }} justify="center">
                        <Col>
                            Professional Wallet for Investors
                        </Col>
                    </Row>
                </Col>
            </div>
        </Animated>
    )
}

export default Loading
