import React, { useState,useEffect,useRef } from "react";
import "./App.css";
import MapboxGLMap from "./reactmap/MapboxGLMap"
import {useDispatch, useSelector} from 'react-redux';
import {increment} from './actions'
import _ from 'lodash'
import {Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import {Line} from "react-chartjs-2"
import "chartjs-plugin-streaming";

import SimSettings from './SimSettings'
import EnvSettings from "./EnvSettings";
import TaskSettings from "./TaskSettings"
import DispatcherParameters from "./DispatcherParameters";

import StreamingChart from "./chart/StreamingChart"
import DeckGLMap from "./reactmap/DeckGLMap"


function App() {
  const dispatch = useDispatch()
  const [message,setMessage] = useState(null)
  const [driversData,setDriversData]= useState({})
  const [envsData, setEnvsData] = useState(null)
  const [tasksData, setTasksData] = useState({})

  const [connection,setConnection] = useState(false)

  const intialData2 = {
    labels: [],
    datasets: [
      {
        label: 'Roaming Drivers',
        fill: false,
        data: [],
      },
      {
        label: 'Picking Up',
        fill: false,
        data: []
      },
      {
        label: 'Fetching to location',
        fill: false,
        data: []
      }]
  }

  const intialData = {
      labels: [],
      datasets: []
    }

  const [lineData, setLineData] = useState(intialData2)
  const [lineDataRegret, setLineDataRegret] = useState(intialData)

  const [ws, setWebSocket] = useState(null)

  function intializeOrder(){
    socket.current.send("[3,0]")
  }
 
  function retrieveOrders(){
    socket.current.send("[3,2]")
  }

  //TODO: 
  function sendParamaters(){
    // var obj = [0,1,{
    //   task_parameters: {
    //     task_value_type: "distance",
    //     value_per_km: 3,
    //     peak_hour_rate: 1.5,
    //     reputation_given_type: "random",
    //     reputation_value: 5
    //   },
    //   dispatcher_parameters:{
    //     dispatcher_interval: 5000,
    //     similiar_reputation: 1.5
    //   }
    // }]
    var obj = [0,1,{
      task_parameters: taskRef.current.getTaskParameters() ,
      dispatcher_parameters: dispatchRef.current.getDispatchParameters()
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
  useEffect(() => {
    if (socket.current != null){
      //console.log("Listening")
      socket.current.onmessage = (evt) => {
        // try {
          let command,current_location,destination,results;
          var res = JSON.parse(evt.data)
          var eId = res.data.environment_id // environment Id
          var dId = res.data.driver_id // driver Id
          console.log("first: "+res.command_first+" second: "+res.command_second)
          switch (res.command_first){
            case 1:
              //console.log(res.data)
              switch(res.command_second){
                case 0: // environment data
                  setMessage(res.data)
                  break
                case 1: // driver and tasks data
                  setDriversData(res.data)
                  //driversData2.current = [res.data]
                  break
                case 2: // tasks data
                  setEnvsData(res.data)
                  break
                case 3: // roaming, picking up, fetching up count stats
                  // setTimeStamps([...timeStamps, res.data.time])
                  // setRdata([...rData,res.data.no_of_roaming_drivers])
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
                  
                  const newLineData =
                  {
                    labels: timeLabels,
                    datasets: [
                      {
                        label: 'Roaming Drivers',
                        fill: false,
                        data: roamingData,
                        lineTension: 0.1,
                        borderColor: 'rgba(255,0,0,1)',
                        backgroundColor: 'rgba(255,0,0,1)',
                        borderDashOffset: 0.0,
                        borderDash: []
                      },
                      {
                        label: 'Picking Up',
                        fill: false,
                        data: pickingData,
                        lineTension: 0.1,
                        borderColor: 'rgba(235,249,17,1)',
                        backgroundColor: 'rgba(235,249,17,1)',
                        borderDashOffset: 0.0,
                        borderDash: []
                      },
                      {
                        label: 'Fetching to location',
                        fill: false,
                        data: fetchingData,
                        lineTension: 0.1,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderDashOffset: 0.0,
                        borderDash: []
                      }]
                  }
                  setLineData(newLineData)
                  break
                case 4:
                  const ldr = lineDataRegret
                  let drivers_regret = res.data.drivers_regret
                  // console.log(res.data)
                  // console.log(ldr)
                  // console.log("Total drivers: "+drivers_regret.length)
                  // console.log("Current drivers: "+ldr.datasets.length)
                  ldr.labels = lineDataRegret.labels.concat(res.data.time)
                  if (ldr.labels.length > 15){
                    ldr.labels.shift()
                  }
                  if (ldr.datasets.length == 0){
                    // console.log("Accessing coz 0")
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
                      //console.log(dr)
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
                case 5:
                  setTasksData(res.data)
              }
              break;
              
          }
        // }catch(err){
        //   console.log(evt)
        //   console.log("Error: "+err)
        // }
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
        setMessage("")
        //childRef.current.resetMap()
        setLineData(intialData2)
        setLineDataRegret(intialData)
    }
  }


  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    title: {
      fontSize: 14,
    },
  }));
  
  const ConnectButton = (props) => {
    if(props.connection){
      return <Button onClick={connectToSocket}  size="small">Disconnect</Button>
    }else{
      return <Button onClick={connectToSocket} size="small">Connect</Button>
    }
  }

  // const [timeStamps, setTimeStamps] = useState([])
  // const [rData, setRdata] = useState([])
  // const initialDataTest = {
  //   datasets: [
  //       {
  //       label: "Dataset 1",
  //       borderColor: "rgb(255, 99, 132)",
  //       backgroundColor: "rgba(255, 99, 132, 0.5)",
  //       lineTension: 0,
  //       borderDash: [8, 4],
  //       data: [
  //         {x: '2019-02-01 09:30:15', y: -0.11700000},
  //         {x: '2019-02-01 09:50:20', y: -0.14400000}
  //       ]
  //       }
  //   ]
  // };

  // function updateChartData(){
  //   if (rData.length > 0){
  //     console.log(rData[rData.length - 1])
  //   }
  //   // data2.datasets[0].data.push({
  //   //   x: Date.now(),
  //   //   y: Math.random() * 100
  //   // });
  // }
  
  // const options2 = {
  //   scales: {
  //     xAxes: [
  //       {
  //         type: "realtime",
  //         realtime: {
  //           onRefresh: function(){
  //             if (rData.length > 0 && timeStamps.length > 0){
  //               console.log(rData[rData.length - 1])
  //               var timeStamp = timeStamps[timeStamps.length - 1]
  //               var roamingData = rData[rData.length - 1]
  //               data2.datasets[0].data.push({
  //                 x: Date.now(),
  //                 y: roamingData
  //               });
  //             }
  //           },
  //           delay: 1000
  //         }
  //       }
  //     ],
  //     yAxes: [{
  //       display: true,
  //       ticks: {
  //         beginAtZero:true,
  //         suggestedMax: 5,
  //         min: 0,
  //         stepSize: 1  
  //       }
  //     }]
  //   }
  // };

  // const [data2, setData2] = useState(initialDataTest)
  

  const childRef = useRef();
  const taskRef = useRef();
  const dispatchRef = useRef();
  const classes = useStyles();
  return (
    <div>
       
       <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={7} style={{height:"55vh"}}>
            <DeckGLMap driversData={driversData} envsData={envsData} tasksData={tasksData}/>
          </Grid>
          <Grid item xs={5}>
            <div>
              <Line data={lineData} options={lineChartOptions} height="auto"/>
              {/* <Line data={lineDataRegret} options={lineChartOptions} height="auto"/> */}
            </div>
            {/* <Line data={data2} options={options2}/> */}
            {/* <StreamingChart/> */}
          </Grid>
          <Grid item xs={3}>
            <TaskSettings ws={socket} ref={taskRef}/>
          </Grid>
          <Grid item xs={3}>
            <DispatcherParameters ws={socket} ref={dispatchRef}/>
          </Grid>
          <Grid item xs={3}>
            <EnvSettings ws={socket}/>
          </Grid>
          <Grid item xs={3}>
            <Card>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>Simulation</Typography>
                    {message}
                </CardContent>
                <CardActions>
                    <ConnectButton connection={connection}/>
                    {/* <Button disabled={connection !== true} onClick={pauseSimulation} size="small">Pause</Button> */}
                    <Button disabled={connection !== true} onClick={sendParamaters} size="small">Submit Paramaters</Button>
                    <Button disabled={connection !== true} onClick={retrieveOrders} size="small">Retrieve Orders</Button>
                    <Button disabled={connection !== true} onClick={intializeOrder} size="small">Start</Button>
                </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

//<LeafletMap markersData={markersData} data={data} />
export default App;
