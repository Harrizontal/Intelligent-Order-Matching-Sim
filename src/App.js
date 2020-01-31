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

import {Line, Bar} from "react-chartjs-2"

import SimSettings from './SimSettings'
import EnvSettings from "./EnvSettings";
import TaskSettings from "./TaskSettings"
import DispatcherParameters from "./DispatcherParameters";

function App() {
  const dispatch = useDispatch()
  const [driversData,setDriversData]= useState(null)
  const [envData, setEnvData] = useState(null)
  const [taskData, setTaskData] = useState(null)

  const [testData, setTestData] = useState(null)
  const [connection,setConnection] = useState(false)
  const [markersData, setMarkersData] = useState([
    { latLng: { lat: 1.2808, lng: 103.8259 }, title: 1 }
  ]);
  const [waypointPosition, setWaypointPosition] = useState([])
  const [timer, setTimer] = useState(0)

  // const initialData = {
  //   labels: ['1', '2', '3', '4', '5', '6'],
  //   datasets: [{
  //     label: '# of Votes',
  //     data: [12, 19, 3, 5, 2, 3],
  //   }]
  // }

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
    var obj = [0,1,{
      task_parameters: {
        task_value_type: "distance",
        value_per_km: 5,
        peak_hour_rate: 2.3,
        reputation_given_type: "fixed",
        reputation_value: 5
      },
      dispatcher_parameters:{
        dispatcher_interval: 5000,
        similiar_reputation: 1.5
      }
    }]
    var data = JSON.stringify(obj)
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
      ]
    }
  }
  useEffect(() => {
    if (socket.current != null){
      //console.log("Listening")
      socket.current.onmessage = (evt) => {
        // const incomingMessage = `Message from WebSocket: ${msg.data}`;
        // console.log(incomingMessage)
        try {
          let command,current_location,destination,results;
          var res = JSON.parse(evt.data)
          var eId = res.data.environment_id // environment Id
          var dId = res.data.driver_id // driver Id
          switch (res.command_first){
            case 1:
              //console.log(res.data)
              switch(res.command_second){
                case 0: // environment data
                  setEnvData([res.data])
                  break
                case 1: // driver data
                  setDriversData([res.data])
                  break
                case 2: // tasks data
                  setTaskData([res.data])
                  break
                case 3: // roaming, picking up, fetching up count stats
                  //console.log(res.data)
                  const roamingData = lineData.datasets[0].data
                  const pickingData = lineData.datasets[1].data
                  const fetchingData = lineData.datasets[2].data
                  roamingData.push(res.data.no_of_roaming_drivers)
                  pickingData.push(res.data.no_of_picking_up_drivers)
                  fetchingData.push(res.data.no_of_travelling_drivers)
                  const newLineData =
                  {
                    labels: lineData.labels.concat(res.data.time),
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
                  if (ldr.datasets.length == 0){
                    // console.log("Accessing coz 0")
                    for (let k = 0; k < drivers_regret.length; k++){
                      var dr = {
                        label: drivers_regret[k].driver_id,
                        fill: false,
                        data: [],
                        lineTension: 0.1,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderDashOffset: 0.0,
                        borderDash: []
                      }
                      dr.data.push(drivers_regret[k].regret)
                      //console.log(dr)
                      ldr.datasets.push(dr)
                    }
                    setLineDataRegret(ldr)
                    //console.log(ldr)
                  }else{
                    for (let k = 0; k < drivers_regret.length; k++){
                      for (let f = 0; f < ldr.datasets.length; f++){
                        if (drivers_regret[k].driver_id == ldr.datasets[f].label){
                          ldr.datasets[f].data.push(drivers_regret[k].regret)
                          break;
                        }
                      }
                    }
                    setLineDataRegret(ldr)
                  }
              }
              break;
            case 2:
             // console.log(evt.data)
              switch(res.command_second){
                case 0: // random point
                  // var command = [2,0,eId,dId,destinationPoint]
                  // var asd = JSON.stringify(command)
                  // ws.send(asd)
                  break;
                case 1:
                  //console.log("[Console]Setting Driver "+dId)
                  // start, destination, and waypoint
                  results = childRef.current.getStartEndWaypoint() // retrieve random start, random end and its waypoints
                  command = [2,1,eId,dId,results[0],results[1],results[2]]
                  //console.log(results[2])
                  socket.current.send(JSON.stringify(command))
                  break;
                case 2: // pathway between two points
                  //console.log("[Console]Calculating pathway between "+res.data.lat_lngs[0] + " and "+res.data.lat_lngs[1])
                  current_location = res.data.lat_lngs[0]
                  destination = res.data.lat_lngs[1]
                  var waypoint = childRef.current.getWaypoint(current_location.toString(),destination.toString())
                  //console.log(waypoint)
                  command = [2,2,eId,dId,waypoint]
                  socket.current.send(JSON.stringify(command))
                  break;
                case 3: // create a node
                  command = [2,3,eId,dId,true]
                  var asd = JSON.stringify(command)
                  socket.current.send(asd)
                  break;
                case 4: // driver move
                  current_location = res.data.lat_lngs[0]
                  destination = res.data.lat_lngs[1]
                  command = [2,4,eId,dId,destination]
                  var asd = JSON.stringify(command)
                  console.log(asd)
                 // console.log("[Console]Driver "+res.data.driver_id+" travelling from "+current_location+" to "+destination)
                  setTimeout(function(){ 
                    if(socket.current != null){
                      socket.current.send(asd)
                    } 
                  }, 50); // 500 speed intially,then 100
                  break;
                case 5: // random destination and waypoint
                  //console.log("[Console]Driver "+res.data.driver_id+" generating new randomness")
                  results = childRef.current.getEndWaypoint(res.data.lat_lngs[0].toString())
                  command = [2,5,eId,dId,res.data.lat_lngs[0],results[0],results[1]]
                 // console.log(command)
                  var asd = JSON.stringify(command)
                  socket.current.send(asd)
                  break;
              }
            case 3:
              switch(res.command_second){
                case 1:
                  // call quad tree function
                 // console.log(evt.data)
                  let pul = res.data.pick_up_coordinates
                  let dol = res.data.drop_off_coordinates
                  //console.log("Pick up location: "+pul +", Drop off location: "+dol)
                  var updated_pul = childRef.current.getNearestNode(pul[0],pul[1])
                  var updated_dol = childRef.current.getNearestNode(dol[0],dol[1])
                  //console.log("New Pick up:"+updated_pul + ", New Drop off:"+updated_dol)
                  var updated_pul_latlng = [updated_pul[1],updated_pul[0]].toString()
                  var updated_dol_latlng = [updated_dol[1],updated_dol[0]].toString()
                  var waypoint = childRef.current.getWaypoint(updated_pul_latlng,updated_dol_latlng)
                  var distance = childRef.current.getDistance(updated_pul_latlng,updated_dol_latlng)
                  if (waypoint.length > 0){
                    command = [
                      3,1,[
                        parseFloat(updated_pul[1]),
                        parseFloat(updated_pul[0])
                      ],[
                        parseFloat(updated_dol[1]),
                        parseFloat(updated_dol[0])
                      ],
                      distance
                    ]
                  }else{
                    // if no waypoint available, we return nil for updated pick up and drop off location
                    command = [3,1,[],[],0]
                  }
                  var string_command = JSON.stringify(command)
                  //console.log(string_command)
                  socket.current.send(string_command)
              }
              
          }
        }catch(err){
          console.log("Error in:" + evt.data)
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
      // clear data
      childRef.current.resetMap()
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

  const childRef = useRef();
  const classes = useStyles();
  return (
    <div>
       <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <MapboxGLMap 
                  driversData={driversData} 
                  envData={envData}
                  taskData={taskData} 
                  waypointPosition={waypointPosition} 
                  ref={childRef}/>
          </Grid>
          <Grid item xs={4}>
            <Line data={lineData} options={lineChartOptions}/>
            <Line data={lineDataRegret} options={lineChartOptions}/>
          </Grid>
          <Grid item xs={3}>
            <TaskSettings ws={socket}/>
          </Grid>
          <Grid item xs={3}>
            <DispatcherParameters ws={socket}/>
          </Grid>
          <Grid item xs={3}>
            <EnvSettings ws={socket}/>
          </Grid>
          <Grid item xs={3}>
            <Card>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>Simulation</Typography>
                    {timer}
                </CardContent>
                <CardActions>
                    <ConnectButton connection={connection}/>
                    {/* <Button disabled={connection !== true} onClick={pauseSimulation} size="small">Pause</Button> */}
                    <Button disabled={connection !== true} onClick={sendParamaters} size="small">Submit Paramaters</Button>
                    <Button disabled={connection !== true} onClick={retrieveOrders} size="small">Retrieve Orders</Button>
                    <Button disabled={connection !== true} onClick={intializeOrder} size="small">D. Order</Button>
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
