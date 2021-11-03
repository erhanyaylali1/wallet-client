import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import axios from 'axios';
import Text from 'antd/lib/typography/Text';
import { Doughnut, Bar } from 'react-chartjs-2';
import { columns, pieChartData, options, summaryStyle, pieOptions } from './constants';
import { TabPanel, TabContext } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import './index.css';

const App = () => {

    const [data, setData] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = React.useState('1');

    const walletData = data.slice(0, -1);

    useEffect(() => {
        setLoading(true)    
        axios.get('http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com')
        .then((res) => {
            setData(res.data.result)
            setHistory(res.data.history)
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        let fetchData = setInterval(() => {
            axios.get('http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com')
            .then((res) => {
                setData(res.data.result)
                setHistory(res.data.history)   
            })
            .catch(err => console.log(err))
        }, 10000);
        return () => {
            clearInterval(fetchData);
        }
    },[data])

    let totalAmount = 0.0;
    console.log(history)

    data.forEach((el, index) => {
        if(index !== data.length - 1){
            totalAmount += parseFloat(el.asset);
        }  
    });

    const labels = walletData.map(el => el.short);
    const asset = walletData.map(el => parseFloat(el.asset));

    pieChartData.labels = labels;
    pieChartData.datasets[0].data = asset


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
            <Box className="asset-table">
                <Table 
                    columns={columns} 
                    dataSource={walletData} 
                    pagination={false} 
                    summary={getSummary}
                    loading={loading}
                />
            </Box>

            { walletData.length ? (
                <div style={{ marginTop: 30 ,paddingBottom: 30 }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                                    <Tab label="Pie Chart" value="1"  />
                                    <Tab label="Bar Chart" value="2" />
                                </Tabs>
                            </Box>
                            <TabPanel value="1">
                                <Doughnut data={pieChartData} options={pieOptions} />
                            </TabPanel>
                            <TabPanel value="2">
                                <Bar data={pieChartData} options={options} />   
                            </TabPanel>
                        </TabContext>
                    </Box>
                </div>
            ) : null }
        </div>
    );
}

export default App;
