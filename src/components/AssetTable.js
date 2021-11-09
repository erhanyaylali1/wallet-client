import { Col } from 'antd';
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
          {data.map(el => <EachAsset asset={el} />)}
      </Col>
    );
}

export default AssetTable
