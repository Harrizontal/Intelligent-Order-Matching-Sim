import React, { useState,useEffect,useRef } from "react";
import "./App.css";
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash'
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import 'bootstrap/dist/css/bootstrap.min.css';

import {Line} from "react-chartjs-2"

import Terminal from './Terminal'
import MapSettings from './MapSettings'
import EnvSettings from "./EnvSettings";
import TaskSettings from "./TaskSettings"
import DispatcherParameters from "./DispatcherParameters";
import DriverParameters from "./DriverParameters";

import DeckGLMap from "./reactmap/DeckGLMap"
import VirusParameters from "./VirusParameters";


function App() {
  const dispatch = useDispatch()
  const [message,setMessage] = useState([])
  const [driversData,setDriversData]= useState({})
  const [envsData, setEnvsData] = useState({})
  const [tasksData, setTasksData] = useState({})

  const [connection,setConnection] = useState(false)

  const intialData = {
    labels: [],
    datasets: [
      {
        label: 'Roaming',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(255,0,0,1)',
        backgroundColor: 'rgba(255,0,0,1)',
        borderDashOffset: 0.0,
        borderDash: []
      },
      {
        label: 'Picking',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(235,249,17,1)',
        backgroundColor: 'rgba(235,249,17,1)',
        borderDashOffset: 0.0,
        borderDash: []
      },
      {
        label: 'Fetching',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,1)',
        borderDashOffset: 0.0,
        borderDash: []
      }]
  }

  const intialData2 = {
      labels: [],
      datasets: []
  }

  const initialDataVirus = {
    labels: [],
    datasets: [
      {
        label: 'Tasks to Drivers',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(255,0,0,1)',
        backgroundColor: 'rgba(255,0,0,1)',
        borderDashOffset: 0.0,
        borderDash: []
      },
      {
        label: 'Drivers to Tasks',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(235,249,17,1)',
        backgroundColor: 'rgba(235,249,17,1)',
        borderDashOffset: 0.0,
        borderDash: []
      }
    ]
  }

  const initialDataEarning = {
    labels: [],
    datasets: [
      {
        label: 'Max',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(255,0,0,1)',
        backgroundColor: 'rgba(255,0,0,1)',
        borderDashOffset: 0.0,
        borderDash: []
      },
      {
        label: 'Average',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(235,249,17,1)',
        backgroundColor: 'rgba(235,249,17,1)',
        borderDashOffset: 0.0,
        borderDash: []
      },
      {
        label: 'Min',
        fill: false,
        data: [],
        lineTension: 0.1,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,1)',
        borderDashOffset: 0.0,
        borderDash: []
      }
    ]
  }

  const [lineData, setLineData] = useState(intialData)
  const [lineDataRegret, setLineDataRegret] = useState(intialData2)
  const [lineDataVirus, setLineDataVirus] = useState(initialDataVirus)
  const [lineDataEarning, setLineDataEarning] = useState(initialDataEarning)

  const [ws, setWebSocket] = useState(null)

  function intializeOrder(){
    socket.current.send("[3,0]")
  }

  function generatecsv(){
    socket.current.send("[3,1]")
  }

  
 
  function retrieveOrders(){
    socket.current.send("[3,2]")
  }

  function generateDriverCSV(){
    socket.current.send("[3,3]")
  }


  function sendParamaters(){
    var obj = [0,1,{
      task_parameters: taskRef.current.getTaskParameters() ,
      dispatcher_parameters: dispatchRef.current.getDispatchParameters(),
      virus_parameters: virusRef.current.getVirusParameters(),
      driver_parameters: driverRef.current.getDriverParameters()
    }]
    var data = JSON.stringify(obj)
    console.log(obj)
    socket.current.send(data)
  }


  const socket = useRef(null)

  const lineChartOptions = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Status of Driver"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero:true,
            suggestedMax: 5,
            min: 0,
            stepSize: 1  
          }
        }
      ]
    }
  }


  const lineChartOptionsEarning = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Total Earnings of Drivers"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero:true,
            suggestedMax: 5,
            min: 0,
            stepSize: 1  
          }
        }
      ]
    }
  }

  const lineChartOptionsVirus= {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Spread count of virus"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero:true,
            suggestedMax: 5,
            min: 0,
            stepSize: 1  
          }
        }
      ]
    }
  }

  const lineChartOptionsRegret= {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Regret of Drivers"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero:true,
            suggestedMax: 5,
            min: 0,
            stepSize: 1  
          }
        }
      ]
    }
  }

  // let lineChartOptionsEarning = {...lineChartOptions}
  // //console.log(lineChartOptionsEarning.scales.xAxes[0].scaleLabel)
  // lineChartOptionsEarning.scales.xAxes[0].scaleLabel.labelString = 

  useEffect(() => {
    if (socket.current != null){
      socket.current.onmessage = (evt) => {
          var res = JSON.parse(evt.data)
          var eId = res.data.environment_id // environment Id
          var dId = res.data.driver_id // driver Id
          console.log("first: "+res.command_first+" second: "+res.command_second)
          switch (res.command_first){
            case 1:
              //console.log(res.data)
              switch(res.command_second){
                case 0: // environment data
                  setMessage(prevArray => [res.data, ...prevArray])
                  break
                case 1: // driver and tasks data
                  setDriversData(res.data)
                  break
                case 2: // tasks data
                  setEnvsData(res.data)
                  break
                case 3:
                  setTasksData(res.data)
                  break;
                case 4: // roaming, picking up, fetching up count stats
                  const roamingData = lineData.datasets[0].data
                  const pickingData = lineData.datasets[1].data
                  const fetchingData = lineData.datasets[2].data
                  roamingData.push(res.data.no_of_roaming_drivers)
                  pickingData.push(res.data.no_of_picking_up_drivers)
                  fetchingData.push(res.data.no_of_travelling_drivers)
                  const timeLabels = lineData.labels.concat(res.data.time)
                  if (roamingData.length > 15){
                    timeLabels.shift()
                    roamingData.shift()
                    pickingData.shift()
                    fetchingData.shift()
                  }
                  
                  const newLineDataStatus = lineData
                  newLineDataStatus.labels = timeLabels
                  newLineDataStatus.datasets[0].data = roamingData
                  newLineDataStatus.datasets[1].data = pickingData
                  newLineDataStatus.datasets[2].data = fetchingData
                  setLineData(newLineDataStatus)
                  break
                case 5:
                  
                  const ldr = lineDataRegret
                  let drivers_regret = res.data.drivers_regret
                  console.log(drivers_regret)
                  if (drivers_regret.length > 20){
                    break
                  }
                  // console.log(res.data)
                  // console.log(ldr)
                  // console.log("Total drivers: "+drivers_regret.length)
                  // console.log("Current drivers: "+ldr.datasets.length)
                  ldr.labels = lineDataRegret.labels.concat(res.data.time)
                  if (ldr.labels.length > 15){
                    ldr.labels.shift()
                  }
                  if (ldr.datasets.length == 0){
                    for (let k = 0; k < drivers_regret.length; k++){
                      let color = "rgba("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+",1)"
                      let dr = {
                        label: drivers_regret[k].driver_id,
                        fill: false,
                        data: [],
                        lineTension: 0.1,
                        borderColor: color,
                        backgroundColor: color,
                        borderDashOffset: 0.0,
                        borderDash: []
                      }
                      dr.data.push(drivers_regret[k].regret)
                      ldr.datasets.push(dr)
                    }
                    setLineDataRegret(ldr)
                  }else{
                    for (let k = 0; k < drivers_regret.length; k++){
                      for (let f = 0; f < ldr.datasets.length; f++){
                        if (drivers_regret[k].driver_id == ldr.datasets[f].label){
                          ldr.datasets[f].data.push(drivers_regret[k].regret)
                          if(ldr.datasets[f].data.length > 15){
                            ldr.datasets[f].data.shift()
                          }
                          break;
                        }
                      }
                    }
                    setLineDataRegret(ldr)
                  }
                  break;
                case 6:
                  const ttdData = lineDataVirus.datasets[0].data // task to drivers
                  const dttData = lineDataVirus.datasets[1].data // drivers to task
                  ttdData.push(res.data.tasks_to_drivers)
                  dttData.push(res.data.drivers_to_tasks)
                  const timeLabelsVirus = lineDataVirus.labels.concat(res.data.time)
                  if (ttdData.length > 15){
                    timeLabelsVirus.shift()
                    ttdData.shift()
                    dttData.shift()
                  }
                  
                  let newLineDataVirus = lineDataVirus
                  newLineDataVirus.labels = timeLabelsVirus
                  newLineDataVirus.datasets[0].data = ttdData
                  newLineDataVirus.datasets[1].data = dttData
                  setLineDataVirus(newLineDataVirus)
                  break
                case 7:
                  const maxData = lineDataEarning.datasets[0].data
                  const averageData = lineDataEarning.datasets[1].data 
                  const minData = lineDataEarning.datasets[2].data 
                  maxData.push(res.data.max_earning)
                  averageData.push(res.data.average_earning)
                  minData.push(res.data.min_earning)
                  const timeLabelsEarning = lineDataEarning.labels.concat(res.data.time)
                  if (maxData.length > 15){
                    timeLabelsEarning.shift()
                    maxData.shift()
                    averageData.shift()
                    minData.shift()
                  }
                  
                  let newLineDataEarning = lineDataEarning
                  newLineDataEarning.labels = timeLabelsEarning
                  newLineDataEarning.datasets[0].data = maxData
                  newLineDataEarning.datasets[1].data = averageData
                  newLineDataEarning.datasets[2].data = minData
                  setLineDataEarning(newLineDataEarning)
                  break
                case 8:
                  break
              }
              break;
          }
      }
    }
  })

  useEffect(() => () => socket.current.close(),[socket])

  const connectToSocket = () => {
    if (socket.current == null){
      try {
        socket.current = new WebSocket("ws://localhost:8080/ws")
        console.log("Connected")
        setConnection(true)
      }catch(e){
        console.log("Unable to connect")
        setConnection(false)
      }
    }else{
        console.log("Disconnect")
        socket.current.close()
        socket.current = null
        setConnection(false)
        setMessage([])
        //childRef.current.resetMap()
        setLineData(intialData)
        setLineDataRegret(intialData2)
        setLineDataVirus(initialDataVirus)
        setLineDataEarning(initialDataEarning)
        setDriversData({})
        setEnvsData({})
        setTasksData({})
    }
  }


  
  const ConnectButton = (props) => {
    if(props.connection){
      return <Button onClick={connectToSocket}  size="small">Disconnect</Button>
    }else{
      return <Button onClick={connectToSocket} size="small">Connect</Button>
    }
  }

  const taskRef = useRef();
  const driverRef = useRef();
  const dispatchRef = useRef();
  const virusRef = useRef();
  return (
    <div style={{display:"flex", flexDirection:"row"}}>
      <div style={{height:"100vh",width:"55vw"}}>
       <DeckGLMap driversData={driversData} envsData={envsData} tasksData={tasksData}/>
      </div>
      <div style={{height:"100vh",width:"45vw"}}>
      <Tabs defaultActiveKey="control" id="uncontrolled-tab-example" style={{marginTop: "5px"}}>
        <Tab eventKey="control" title="Control">
          <Terminal data={message}/>
          <EnvSettings ws={socket}/>
          <Card style={{margin:"1%"}}>
            <Card.Header>Main</Card.Header>
            <Card.Body>
              <Card.Text>
                  <ConnectButton connection={connection} style={{margin:"1%"}}/>
                  <Button disabled={connection !== true} style={{margin:"1%"}} onClick={sendParamaters} size="small">Submit Paramaters</Button>
                  <Button disabled={connection !== true} style={{margin:"1%"}} onClick={retrieveOrders} size="small">Retrieve Orders</Button>
                  <Button disabled={connection !== true} style={{margin:"1%"}} onClick={intializeOrder} size="small">Start</Button>
                  <Button disabled={connection !== true} style={{margin:"1%"}} onClick={generatecsv} size="small">Generate Virus CSV</Button>
                  <Button disabled={connection !== true} style={{margin:"1%"}} onClick={generateDriverCSV} size="small">Generate Drivers' Stats CSV</Button>
              </Card.Text>
            </Card.Body>
          </Card>
         
        </Tab>
        <Tab eventKey="general" title="General">
          <TaskSettings ws={socket} ref={taskRef}/>
          <DriverParameters ws={socket} ref={driverRef}/>
          <DispatcherParameters ws={socket} ref={dispatchRef}/>
        </Tab>
        <Tab eventKey="virus" title="Virus">
          <VirusParameters ws={socket} ref={virusRef}/>
        </Tab>
        <Tab eventKey="overviewchart" title="Overview Chart" style={{padding:"1%"}}>
          <Line data={lineData} options={lineChartOptions} width="auto" height="100"/>
          <Line data={lineDataEarning} options={lineChartOptionsEarning} width="auto" height="100"/>
          <Line data={lineDataVirus} options={lineChartOptionsVirus} width="auto" height="100"/>
        </Tab>
        <Tab eventKey="driverchart" title="Driver Chart" style={{padding:"1%"}}>
          <Line data={lineDataRegret} options={lineChartOptionsRegret} width="auto" height="auto"/>
        </Tab>
        <Tab eventKey="display" title="Display" >
          <MapSettings/>
        </Tab>
      </Tabs>
       
        
      </div>
    </div>
  )
}

//<LeafletMap markersData={markersData} data={data} />
export default App;
