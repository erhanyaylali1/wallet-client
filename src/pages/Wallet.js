import React, { useEffect } from 'react'
import { Table, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { pieChartData, options, summaryStyle, pieOptions, lineChartData, lineChartOptions } from '../constants/constants';
import { TabPanel, TabContext } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import { useSelector } from 'react-redux';
import { getUserWallet } from '../features/userSlice';
import { Link } from 'react-router-dom';
import { getIsLoading, getLanguage } from '../features/generalSlice';
import { useNavigate } from "react-router-dom";
import text from '../constants/language'
import { capitalize } from '../utils/capitalize';

const Wallet = () => {

    const language = useSelector(getLanguage);
    const [value, setValue] = React.useState('1');
    const { data, history, totalAssets } = useSelector(getUserWallet)
    const loading = useSelector(getIsLoading)
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    }, [navigate])

    const walletData = data;

    let percentage = 0;
    if(history.length > 1){
        const yesterdayAsset = history.slice(history.length - 2, history.length - 1)[0].totalAssets
        percentage = (totalAssets - yesterdayAsset) / yesterdayAsset * 100;
    }
    
    const allDataGraph = history.slice(0, -1).map((el) => el.totalAssets)
    allDataGraph.push(totalAssets.toFixed(2));
    lineChartData.labels = history.map((el) => el.date.slice(0, -5))
    lineChartData.datasets[0].data = allDataGraph

    const labels = walletData.map(el => el.short);
    const asset = walletData.map(el => parseFloat(el.asset));
    pieChartData.labels = labels;
    pieChartData.datasets[0].data = asset

    const columns = [
        {
            title: text[language].code,
            dataIndex: 'short',
            key: 'short',
            width: 10,
            render: (code, record) => (
                <Tooltip placement="topLeft" title={record.name} className="eachAssetToolTip">
                  {capitalize(record.short)}
                </Tooltip>
            ),
        },
        {
          title: text[language].price,
          dataIndex: 'currentPrice',
          key: 'currentPrice',
          sorter: (a, b) => parseFloat(a.currentPrice) - parseFloat(b.currentPrice),
          render: (value, record, index) => {
                if(record.id < 56) {
                    return (
                        <>
                          ${ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 8 }) } 
                        </>
                    )
                } else {
                    return (
                        <>
                            ₺{ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 8 }) } 
                        </>
                    )
                }
          }
        },
        {
          title: text[language].daily,
          dataIndex: 'dailyDifference',
          key: 'dailyDifference',
          sorter: (a, b) => a.dailyDifference.localeCompare(b.dailyDifference),
          render: (value) => {
              if(parseFloat(value) >= 0) {
                  return (
                    <span style={{ color: '#2cbd2c' }}>%{ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 1 }) }</span>
                  )
              }  else {
                  return (
                    <span style={{ color: 'red' }}>%{ parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 1 }) }</span>
                  )
              }
          } 
          
        },
        {
            title: text[language].asset,
            dataIndex: 'asset',
            key: 'asset',
            sorter: (a, b) =>parseFloat(a.asset) - parseFloat(b.asset),
            render: text => <>₺{parseFloat(text).toLocaleString(undefined, { maximumFractionDigits: 1 })}</>,
          },
    ];  

    const getSummary = () => {
        return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} style={summaryStyle}>
                <Text style={summaryStyle}>{text[language].total}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} >
                  {percentage > 0 ? (
                    <span style={{ color: '#2cbd2c' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                  ):(percentage === 0 ? (
                    <span style={{ color: 'black' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                    ):(
                    <span style={{ color: 'red' }}> %{ percentage.toLocaleString(undefined, { maximumFractionDigits: 2 }) } </span>
                  ))}
                    
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
        return (
            <div style={{ marginTop: 20 }} className="emptyAssets">
                <p>{text[language].emptyWallet1} </p>
                <p>{text[language].emptyWallet2} <Link to="/profile">{text[language].emptyWallet3}</Link> {text[language].emptyWallet4}</p>
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
                                    <Tab label={text[language].tab1} value="1" />
                                    <Tab label={text[language].tab2} value="2" />
                                    <Tab label={text[language].tab3} value="3" />
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
