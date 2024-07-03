import './App.css';
import {useEffect, useState} from 'react';
import {SideMenu} from './SideMenu'
import {Header} from './Header'
import {CardContainer} from './CardContainer'
import {BarChartContainer, DonutChartContainer} from './ChartContainer'
import { BasicTable } from './BasicTable'

const optionsArray = [
  {option: 'Dashboard', icon: 'key'}, 
  {option: 'Product', icon: 'cube'},
  {option: 'Customer', icon: 'user-circle'},
  {option: 'Income', icon: 'currency-circle-dollar'},
  {option: 'Promote', icon: 'arrow-square-out'},
  {option: 'Help', icon: 'question'},
];

function App() {
  const [totalRequest, setTotalRequest] = useState("");
  const [avgRequestTime, setAvgRequestTime] = useState("");
  const [failedRequests, setFailedRequests] = useState("");
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Total Request
    fetch("http://127.0.0.1:3000/total_request")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setTotalRequest(resData.value);
    })
    .catch(error => setError(error))
    
    // Fetch Average Request Time
    fetch("http://127.0.0.1:3000/avg_request_time")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setAvgRequestTime(resData.value);
    })
    .catch(error => setError(error))
    
    // Fetch Failed Requests
    fetch("http://127.0.0.1:3000/failed_requests")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setFailedRequests(resData.value);
    })
    .catch(error => setError(error))

    // Fetch Data for the Bar chart
    fetch("http://127.0.0.1:3000/bar_chart_data")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setBarChartData(Array.from(resData.data));
    })
    .catch(error => setError(error))

    // Fetch Data for the Pie chart
    fetch("http://127.0.0.1:3000/pie_chart_data")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setPieChartData(resData.data.map((data, i)=> ({id: i, value: data.value, label: data.label})));
    })
    .catch(error => setError(error))

    // Fetch Data for the Table
    fetch("http://127.0.0.1:3000/table_data")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setTableData(resData.data.map((data)=> ({id: data.id, requestId: data.request_id, requestStatus: data.request_status, requestType: data.request_type, requestTime: data.request_time, contentType: data.content_type, ipAddress: data.ip_address, os: data.os, userAgent: data.user_agent})));
    })
    .catch(error => setError(error))
  }, []);  

  const cardsData = [
    {icon: {name: 'arrow-square-in', color: '#37b24d', background: '#b2f2bb'}, heading: 'Total Request', value: totalRequest},
    {icon: {name: 'clock-clockwise', color: '#1c7ed6', background: '#a5d8ff'}, heading: 'Avg. Response Time', value: avgRequestTime},
    {icon: {name: 'thumbs-down', color: '#f03e3e', background: '#ffc9c9'}, heading: 'Failed Requests', value: failedRequests}
  ];

  return (
    <>
      <SideMenu options={optionsArray} activeIndex={0}/>
      <div className="container">
        <Header />
        <CardContainer cards={cardsData}/>
        <BarChartContainer id='column-chart' title="Request Type" description="Number of requests based on type" data={barChartData}/>
        <DonutChartContainer id='donut-chart' title="Browser" description="No of requests by browser" data={pieChartData}/>
        <BasicTable id="basic-table" title="Requests" description="" data={tableData}/>
      </div>
    </>
  )
}

export default App
