import React, { useEffect, useState } from 'react'
import { Table, Select } from 'antd';
import axios from 'axios';
import Text from 'antd/lib/typography/Text';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { columns, pieChartData, options, summaryStyle, pieOptions, lineChartData, lineChartOptions } from './constants';
import { TabPanel, TabContext } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import './index.css';
const { Option } = Select;

const App = () => {

    const [data, setData] = useState([]);
    const [history, setHistory] = useState([]);
    const [totalAssets, setTotalAssets] = useState(0);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = React.useState('1');
    const [currencyHistory, setCurrencyHistory] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const endpoint = "http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com"

    const walletData = data.slice(0, -1);

    useEffect(() => {
        setLoading(true)    
        axios.get(endpoint)
        .then((res) => {
            setData(res.data.result)
            setHistory(res.data.history.reverse())
            setTotalAssets(res.data.totalAssets)
            setCurrencyHistory(res.data.historyCurrency.reverse())
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }, [])

    let percentage = 0;
    if(history.length){
        const yesterdayAsset = history.slice(history.length - 2, history.length - 1)[0].totalAssets
        percentage = (totalAssets - yesterdayAsset) / yesterdayAsset * 100;
    }
    
    useEffect(() => {
        let fetchData = setInterval(() => {
            axios.get(endpoint)
            .then((res) => {
                setData(res.data.result)
                setHistory(res.data.history.reverse())
                setTotalAssets(res.data.totalAssets)
                setCurrencyHistory(res.data.historyCurrency.reverse())
            })
            .catch(err => console.log(err))
        }, 10000);
        return () => {
            clearInterval(fetchData);
        }
    },[data])

    if(selectedValues.length === 0){
        const allDataGraph = history.slice(0, -1).map((el) => el.totalAssets)
        allDataGraph.push(totalAssets.toFixed(2));
        lineChartData.labels = history.map((el) => el.date.slice(0, -5))
        lineChartData.datasets = [{
            data: allDataGraph,
            label: 'Total Assets',
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 4,
            borderWidth: 2,
        }]
    } else {
        let names = [];
        const newDataSet = [];

        selectedValues.forEach(el => {
            if(names.indexOf(el) === -1){
                names.push(el)
            }
        })
        const selecteds = [];
        names.forEach(el => {
            selecteds.push(currencyHistory.filter(el2 => el2.name === el));
        })
        
        selecteds.forEach((el, index) => {
            newDataSet.push({
                label: el[0].name,
                data: el.map(el2 => el2.totalAsset),
                fill: false,
                backgroundColor: pieChartData.datasets[0].borderColor[index], 
                borderColor: pieChartData.datasets[0].borderColor[index],
                pointRadius: 4,
                borderWidth: 2,
            })
        })
        lineChartData.labels = history.map((el) => el.date.slice(0, -5))
        lineChartData.datasets= newDataSet;        
    }

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
              <Table.Summary.Cell index={2} >
                  {percentage > 0 ? (
                    <span style={{ color: '#2cbd2c' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                  ):(
                    <span style={{ color: 'red' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                  )}
                    
              </Table.Summary.Cell>          
              <Table.Summary.Cell index={3}>
                <Text style={summaryStyle}>  
                    ₺{totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
        )
    }

    const renderLineCharts = () => {
        return ["YFAY-1", "AFA", "AFT", "IPJ", "BTC", "ETH", "BNB", "SOL"].map((el, index) => (
            <Option key={el}>{el}</Option>
        ))
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
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%', marginBottom: 30 }}
                                        placeholder="Please select"
                                        value={selectedValues}
                                        onChange={(values) => { 
                                            if(values.length){
                                                setSelectedValues(values) 
                                            } else {
                                                setSelectedValues([]) 
                                            }
                                        }}
                                    >
                                        {renderLineCharts()}
                                    </Select>
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

export default App;
