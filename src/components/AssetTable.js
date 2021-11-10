import { Col, Row } from 'antd';
import React from 'react'
import EachAsset from './EachAsset';

const AssetTable = ({ assets }) => {

    const data = assets.map((el) => ({
            id: el.id,
            name: el.name,
            short: el.short,
            quantity: el.UserHasAsset.quantity
    }))
    
    return (
      <Col>
        {data.map((el, index) => <EachAsset asset={el} even={index % 2 === 0 ? true:false}/>)}
      </Col>
    );
}

export default AssetTable
