import React, {  useEffect, useState } from 'react'
import { Table } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { columns, pieChartData, options, summaryStyle, pieOptions, lineChartData, lineChartOptions } from '../constants/constants';
import { TabPanel, TabContext } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import { useSelector } from 'react-redux';
import { getUserWallet } from '../features/userSlice';
import { Link } from 'react-router-dom';
import { getIsLoading } from '../features/generalSlice';

const Wallet = () => {

    const [value, setValue] = React.useState('1');
    const { data, history, totalAssets } = useSelector(getUserWallet)
    const loading = useSelector(getIsLoading)
    
    const walletData = data.slice(0, -1);

    let percentage = 0;
    
    const allDataGraph = history.slice(0, -1).map((el) => el.totalAssets)
    allDataGraph.push(totalAssets.toFixed(2));
    lineChartData.labels = history.map((el) => el.date.slice(0, -5))
    lineChartData.datasets[0].data = allDataGraph

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
              <Table.Summary.Cell index={1} >
                  {percentage > 0 ? (
                    <span style={{ color: '#2cbd2c' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                  ):(
                    <span style={{ color: 'red' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                  )}
                    
              </Table.Summary.Cell>            
              <Table.Summary.Cell index={3} colSpan={2}>
                <Text style={summaryStyle}>  
                    ₺{totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
        )
    }

    if(!loading && totalAssets === 0) {
        console.log(loading)
        console.log(data)
        return (
            <div style={{ marginTop: 20 }} className="emptyAssets">
                <p>Looks like you didn't add any asset to your wallet. </p>
                <p>Go to <Link to="/profile">Your Asset Page</Link> and start to add your assets.</p>
            </div>
        )
    }

    return (
        <div style={{ marginTop: 20 }}>
            <Box className="asset-table">
                <Table 
                    columns={columns} 
                    dataSource={walletData} 
                    pagination={false} 
                    summary={getSummary}
                    loading={loading}
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                />
            </Box>

            { walletData.length ? (
                <div style={{ marginTop: 30 ,paddingBottom: 30 }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                                    <Tab label="Pie Chart" value="1" />
                                    <Tab label="Bar Chart" value="2" />
                                    <Tab label="Line Chart" value="3" />
                                </Tabs>
                            </Box>
                            <Box style={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TabPanel value="1">
                                    <Pie data={pieChartData} options={pieOptions} />
                                </TabPanel>
                                <TabPanel value="2">
                                    <Bar data={pieChartData} options={options} height={250} />
                                </TabPanel>
                                <TabPanel value="3">
                                    <Line data={lineChartData} options={lineChartOptions} height={250} />   
                                </TabPanel>
                            </Box>
                        </TabContext>
                    </Box>
                </div>
            ) : null }
        </div>
    );
}

export default Wallet;
