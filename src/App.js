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

import SimSettings from './SimSettings'
import EnvSettings from "./EnvSettings";

function App() {
  const dispatch = useDispatch()
  const [driversData,setDriversData]= useState(null)
  const [polygonData, setPolygonData] = useState(null)
  const [testData, setTestData] = useState(null)
  const [connection,setConnection] = useState(false)
  const [markersData, setMarkersData] = useState([
    { latLng: { lat: 1.2808, lng: 103.8259 }, title: 1 }
  ]);
  const [waypointPosition, setWaypointPosition] = useState([])

  const [ws, setWebSocket] = useState(null)
  function connect() {
    var ws = new WebSocket("ws://localhost:8080/ws")

    ws.onerror = (err) => {
      ws.close();
    }

    ws.onopen = () => {
      console.log("Connected")
      setWebSocket(ws)
    }

    ws.onclose = () => {
      console.log("Socket Closed Connection")
      setTimeout(function() {
        connect();
      }, 4000);
    }
    ws.onmessage = evt => {
      try {
        let command,current_location,destination,results;
        var res = JSON.parse(evt.data)
        //console.log(res)
        
        if(typeof res.type != "undefined"){
          if(res.type == "FeatureCollection"){
              console.log(res)
              setDriversData([res])
          }
        }else{
          var eId = res.data.environment_id // environment Id
          var dId = res.data.driver_id // driver Id
          switch (res.command_first){
            case 2:
              switch(res.command_second){
                case 0: // random point
                  // var command = [2,0,eId,dId,destinationPoint]
                  // var asd = JSON.stringify(command)
                  // ws.send(asd)
                  break;
                case 1:
                  console.log("[Console]Setting Driver "+dId)
                  // start, destination, and waypoint
                  results = childRef.current.getStartEndWaypoint() // retrieve random start, random end and its waypoints
                  command = [2,1,eId,dId,results[0],results[1],results[2]]
                  console.log(results[2])
                  ws.send(JSON.stringify(command))
                  break;
                case 2: // pathway between two points
                  console.log("[Console]Calculating pathway between "+res.data.lat_lngs[0] + " and "+res.data.lat_lngs[1])
                  current_location = res.data.lat_lngs[0]
                  destination = res.data.lat_lngs[1]
                  var waypoint = childRef.current.getWaypoint(current_location.toString(),destination.toString())
                  console.log(waypoint)
                  command = [2,2,eId,dId,waypoint]
                  ws.send(JSON.stringify(command))
                  break;
                case 3: // create a node
                  command = [2,3,eId,dId,true]
                  var asd = JSON.stringify(command)
                  ws.send(asd)
                  break;
                case 4: // driver move
                  current_location = res.data.lat_lngs[0]
                  destination = res.data.lat_lngs[1]
                  command = [2,4,eId,dId,destination]
                  var asd = JSON.stringify(command)
                  console.log("[Console]Driver "+res.data.driver_id+" travelling from "+current_location+" to "+destination)
                  setTimeout(function(){ ws.send(asd) }, 500);
                  break;
                case 5: // random destination and waypoint
                console.log("[Console]Driver "+res.data.driver_id+" generating new randomness")
                  // var destinationPoint = [7,7]
                  // var waypoint = [response[4],[5,5],[6,6],destinationPoint]
                  results = childRef.current.getEndWaypoint(res.data.lat_lngs[0].toString())
                  command = [2,5,eId,dId,res.data.lat_lngs[0],results[0],results[1]]
                  console.log(command)
                  var asd = JSON.stringify(command)
                  ws.send(asd)
                  break;
              }
          }
        }
        // var geojsonData = JSON.parse(evt.data)
  
        // if(geojsonData.type == "FeatureCollection"){
        //   console.log(geojsonData)
        //   setDriversData([geojsonData])
        // }
      }catch(err){
        console.log("error in:" + evt.data)
      }
    }
  }

  


  function intializeOrder(){
    socket.current.send("[3,0]")
  }
 
  function pauseSimulation(){
    socket.current.send("[0]")
  }

  function testOM(){
    socket.current.send("[3,2]")
  }

  const socket = useRef(null)

  useEffect(() => {
    if (socket.current != null){
      console.log("Listening")
      socket.current.onmessage = (evt) => {
        // const incomingMessage = `Message from WebSocket: ${msg.data}`;
        // console.log(incomingMessage)
        try {
          let command,current_location,destination,results;
          var res = JSON.parse(evt.data)
          //console.log(res)
          
          if(typeof res.type != "undefined"){
            if(res.type == "FeatureCollection"){
                console.log(res)
                setDriversData([res])
            }
          }else{
            var eId = res.data.environment_id // environment Id
            var dId = res.data.driver_id // driver Id
            switch (res.command_first){
              case 2:
                console.log(evt.data)
                switch(res.command_second){
                  case 0: // random point
                    // var command = [2,0,eId,dId,destinationPoint]
                    // var asd = JSON.stringify(command)
                    // ws.send(asd)
                    break;
                  case 1:
                    console.log("[Console]Setting Driver "+dId)
                    // start, destination, and waypoint
                    results = childRef.current.getStartEndWaypoint() // retrieve random start, random end and its waypoints
                    command = [2,1,eId,dId,results[0],results[1],results[2]]
                    console.log(results[2])
                    socket.current.send(JSON.stringify(command))
                    break;
                  case 2: // pathway between two points
                    console.log("[Console]Calculating pathway between "+res.data.lat_lngs[0] + " and "+res.data.lat_lngs[1])
                    current_location = res.data.lat_lngs[0]
                    destination = res.data.lat_lngs[1]
                    var waypoint = childRef.current.getWaypoint(current_location.toString(),destination.toString())
                    console.log(waypoint)
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
                    console.log("[Console]Driver "+res.data.driver_id+" travelling from "+current_location+" to "+destination)
                    setTimeout(function(){ socket.current.send(asd) }, 500);
                    break;
                  case 5: // random destination and waypoint
                  console.log("[Console]Driver "+res.data.driver_id+" generating new randomness")
                    results = childRef.current.getEndWaypoint(res.data.lat_lngs[0].toString())
                    command = [2,5,eId,dId,res.data.lat_lngs[0],results[0],results[1]]
                    console.log(command)
                    var asd = JSON.stringify(command)
                    socket.current.send(asd)
                    break;
                }
              case 3:
                switch(res.command_second){
                  case 1:
                    // call quad tree function
                    console.log(evt.data)
                    let pul = res.data.pick_up_coordinates
                    let dol = res.data.drop_off_coordinates
                    console.log("Pick up location: "+pul +", Drop off location: "+dol)
                    var updated_pul = childRef.current.getNearestNode(pul[0],pul[1])
                    var updated_dol = childRef.current.getNearestNode(dol[0],dol[1])
                    console.log("New Pick up:"+updated_pul + ", New Drop off:"+updated_dol)
                    command = [
                      3,1,[
                        parseFloat(updated_pul[0]),
                        parseFloat(updated_pul[1])
                      ],[
                        parseFloat(updated_dol[0]),
                        parseFloat(updated_dol[1])
                      ]
                    ]
                    var string_command = JSON.stringify(command)
                    console.log(string_command)
                    socket.current.send(string_command)
                }
                
            }
          }
        }catch(err){
          console.log("error in:" + evt.data)
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
          <Grid item xs={12}>
            <MapboxGLMap driversPosition={driversData} 
                  polygonData={polygonData} 
                  testData ={testData} 
                  waypointPosition={waypointPosition} 
                  ref={childRef}/>
          </Grid>
          <Grid item xs={3}>
            <Card>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>Simulation</Typography>
                </CardContent>
                <CardActions>
                    <ConnectButton connection={connection}/>
                    <Button disabled={connection !== true} onClick={pauseSimulation} size="small">Pause</Button>
                    <Button disabled={connection !== true} onClick={intializeOrder} size="small">D. Order</Button>
                </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <EnvSettings ws={socket}/>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>Driver settings</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>Tasks settings</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

//<LeafletMap markersData={markersData} data={data} />
export default App;
