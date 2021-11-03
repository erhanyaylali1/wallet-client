import { Tooltip } from "antd";

let delayed;

export const pieChartData = {
    labels: [],
    datasets: [
      {
        barPercentage: 0.7,
        label: '₺ Value of Asset',
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(128, 53, 75, 0.2)',
            'rgba(63, 201, 125, 0.2)',
        ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',    
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(128, 53, 75, 1)',
            'rgba(63, 201, 125, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 20,
        cutout: 60
      },
    ],
};

export const options = {
    animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
    },
};

export const pieOptions = {
    responsive: true,
    animation: {
        animateScale: true,
        animateRotate: true
    },
}

export const columns = [
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

export const summaryStyle = {
    fontWeight: 700,
}