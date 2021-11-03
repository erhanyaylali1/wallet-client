import React, { useEffect, useState } from 'react'
import { Table, Tooltip } from 'antd';
import axios from 'axios';
import Text from 'antd/lib/typography/Text';

const columns = [
    {
        title: 'Code',
        dataIndex: 'short',
        key: 'short',
        sorter: (a, b) => a.short.localeCompare(b.short),
        render: (code, record) => (
            <Tooltip placement="topLeft" title={record.name}>
              {record.short}
            </Tooltip>
        ),
    },
    {
      title: 'Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      sorter: (a, b) => parseFloat(a.currentPrice) - parseFloat(b.currentPrice),
      render: (value, record, index) => {
          if(index < 4) {
              return (
                <>
                   ₺{ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) } 
                </>
              )
          } else {
              return (
                <>              
                   ${ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) } 
                </>
              )
          }
      }
    },
    {
      title: 'Daily',
      dataIndex: 'dailyDifference',
      key: 'dailyDifference',
      sorter: (a, b) => a.dailyDifference.localeCompare(b.dailyDifference),
      render: (value) => {
          if(parseFloat(value) > 0) {
              return (
                <span style={{ color: '#2cbd2c' }}>%{ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</span>
              )
          } else {
              return (
                <span style={{ color: 'red' }}>%{ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</span>
              )
          }
      } 
      
    },
    {
        title: 'Assets',
        dataIndex: 'asset',
        key: 'asset',
        sorter: (a, b) =>parseFloat(a.asset) - parseFloat(b.asset),
        render: text => <>₺{parseFloat(text).toLocaleString(undefined, { maximumFractionDigits: 2 })}</>,
      },
];  

const App = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const summaryStyle = {
        fontWeight: 700,
    }

    useEffect(() => {
        setLoading(true)    
        axios.get('http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com/')
        .then((res) => setData(res.data))
        .then(() => setLoading(false))
    }, [])

    useEffect(() => {
        let fetchData = setInterval(() => {
            axios.get('http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com/')
            .then((res) => setData(res.data));
        }, 60000);
        return () => {
            clearInterval(fetchData);
        }
    },[data])

    let totalAmount = 0.0;

    data.forEach((el, index) => {
        if(index !== data.length - 1){
            totalAmount += parseFloat(el.asset);
        }  
    });

    const getSummary = () => {
        return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} style={summaryStyle}>
                <Text style={summaryStyle}>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} />  
              <Table.Summary.Cell index={2} />            
              <Table.Summary.Cell index={3}>
                <Text style={summaryStyle}>  
                    ₺{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
        )
    }

    return (
        <div>
            <Table 
                columns={columns} 
                dataSource={data.slice(0, data.length - 1)} 
                pagination={false} 
                summary={getSummary}
                loading={loading}
            />
        </div>
    );
}

export default App;
