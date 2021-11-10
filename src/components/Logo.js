import { Col, Row, Typography } from 'antd'
import React from 'react'
import { WalletOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Logo = () => {
    return (
        <Row align="center" justify="center" style={{ marginTop: 30, marginBottom: 30 }}>
            <Col style={{ display: 'flex', alignItems: 'center'}}>
                <WalletOutlined className="loginIcon" />
            </Col>
            <Col>
                <Title level={2} style={{ marginBottom: 5, marginLeft: 10 }}>eWallet</Title>
            </Col>
        </Row>
    )
}

export default Logo
