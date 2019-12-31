import React, { useState,useEffect,useRef } from "react";
import "./App.css";
import LeafletMap from "./map/LeafletMap";
import MapboxGLMap from "./reactmap/MapboxGLMap"
import MapboxGLMap2 from "./reactmap/MapboxGLMap2"
import {useDispatch, useSelector} from 'react-redux';
import {increment} from './actions'
import fakedrivers from './reactmap/fakedriver.json'
import _ from 'lodash'
import { geoJSON } from "leaflet";

function App() {
  const dispatch = useDispatch()
  const [driversData,setDriversData]= useState([fakedrivers])
  const [testData, setTestData] = useState(null)
  const [markersData, setMarkersData] = useState([
    { latLng: { lat: 1.2808, lng: 103.8259 }, title: 1 }
  ]);
  const [waypointPosition, setWaypointPosition] = useState([])

  const [data, setData] = useState(null)


  function addMarker() {
    const lastMarker = markersData[markersData.length - 1];

    setMarkersData([
      ...markersData,
      {
        title: +lastMarker.title + 1,
        latLng: {
          lat: lastMarker.latLng.lat + 0.001,
          lng: lastMarker.latLng.lng + 0.001
        }
      }
    ]);
  }
  
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
      setData(evt.data)
      // 2,1,EnvironmentId,DriverId
      try {
        var string = evt.data
        var response = JSON.parse("["+string+"]")
        // var geojsonData = JSON.parse(evt.data)
        //   console.log(geojsonData.type)
        // if(geojsonData.type == "FeatureCollection"){
        //   setDriversData([geojsonData])
        // }
        
        var eId = response[2] // environment Id
        var dId = response[3] // driver Id
        // var startingPoint = [1.2774947,103.8460384]
        // var destinationPoint = [1.2770392,103.846895]
        // var waypoint = [startingPoint,[1.2777352,103.846279],destinationPoint]
        var startingPoint = [1,1]
        var destinationPoint = [4,4]
        var waypoint = [startingPoint,[2,2],[3,3],destinationPoint]
        switch (response[0]){
          case 2:
            switch(response[1]){
              case 0: // random point
                var command = [2,0,eId,dId,destinationPoint]
                var asd = JSON.stringify(command)
                ws.send(asd)
                break;
              case 1:
                console.log("[Console]Setting Driver "+dId)
                // start, destination, and waypoint
                var command = [2,1,eId,dId,startingPoint,destinationPoint,waypoint]
                var results = childRef.current.getStartEndWaypoint()
                var newCommand = [2,1,eId,dId,results[0],results[1],results[2]]
                setWaypointPosition(results[2])
                console.log(results[2])
                //console.log(newCommand)
                var asd = JSON.stringify(newCommand)
                ws.send(asd)
                break;
              case 2: // pathway between two points
                console.log("Calculating pathway between "+response[4] + " and "+response[5])
                var waypoint = childRef.current.getWaypoint(response[4],response[5])
                console.log(waypoint)

                // if (response[4][0] == 4){
                //   var waypoint = [[4,4],[5,5],[6,6],[7,7]]
                // }
                // var waypoint = []
                // for (var i = response[4][0]; i <= response[5][0]; i++){
                //   waypoint.push([i,i])
                // }
                // console.log("waypoint sent:"+waypoint)
                var command = [2,2,eId,dId,waypoint]
                var asd = JSON.stringify(command)
                ws.send(asd)
                break;
              case 3: // create a node
                var command = [2,3,eId,dId,true]
                var asd = JSON.stringify(command)
                //console.log("Created driver node at "+response[4])
                ws.send(asd)
                break;
              case 4: // driver move
                var arriveLocation =  response[5]
                var command = [2,4,eId,dId,arriveLocation]
                var asd = JSON.stringify(command)
                console.log("[Console]Driver "+response[3]+" travelling from "+response[4]+" to "+response[5])
                setTimeout(function(){ ws.send(asd) }, 500);
                
                break;
              case 5: // random destination and waypoint
              console.log("[Console]Driver "+response[3]+" generating new randomness")
                // var destinationPoint = [7,7]
                // var waypoint = [response[4],[5,5],[6,6],destinationPoint]
                var results = childRef.current.getEndWaypoint(response[4])
                var command = [2,5,eId,dId,response[4],results[0],results[1]]
                console.log(command)
                var asd = JSON.stringify(command)
                ws.send(asd)
            }
        }
        var geojsonData = JSON.parse(evt.data)

        if(geojsonData.type == "FeatureCollection"){
          console.log(geojsonData)
          setDriversData([geojsonData])
        }
      }catch(err){
        console.log("error in:" + evt.data)
      }
      
    }
  }

  useEffect(() => {
    if (ws == null){
      connect()
    }
  })

  function displayRoads() {
    addMarker();
  }

  /**
   * Generate environment
   * Use [1]
   */

  function intializeOrder(){
    ws.send("[0]")
  }
  function sendMessage(){
    console.log("Spawn Environment 1")
    ws.send("[1,1]")
  }

  function sendMessage2(){
    console.log("Spawn Environment 2")
    ws.send("[1,1]")
  }
  
  function testMessage(){
    var randomPoint = [1.2774947,103.8460384]
    var command = [2,0,3,2,[randomPoint]]
    var asdasd = JSON.stringify(command)
    console.log(asdasd)
  }



  const marker = useSelector(state => state.markerStuff);
  // return (
  //   <div style={{ width: "100%", height: "100vh", position: "relative" }}>
  //     {/* <LeafletMap markersData={markersData} data={data} /> */}
  //     <MapboxGLMap/>
  //     <div>{data}</div>
  //     <button onClick={addMarker}>Move marker</button>
  //     <button onClick={displayRoads}>Display roads</button>
  //     <button onClick={intializeOrder}>Intialize order distributor</button>
  //     <button onClick={sendMessage}>Spawn Environment 1</button>
  //     <button onClick={sendMessage2}>Spawn Environment 2</button>
  //     <button onClick={testMessage}>TestButton</button>
  //   </div>
  // );
  function addRandomCoordinates(){
      const data = driversData[0]
      let driversFeatures = data.features
      driversFeatures.forEach((value,index) => {
        value.geometry.coordinates[0] = value.geometry.coordinates[0] - 0.0002
        value.geometry.coordinates[1] = value.geometry.coordinates[1] - 0.0002
      })
      console.log("added random coordinates to all driver positions")
      console.log(data)
      setDriversData([data])
    
  }
  function addNewDriver(){
      const data = driversData[0]
      var newDriver = {
        "type": "Feature",
        "geometry": {
            "type":"Point",
            "coordinates": [103.8430676,1.28 + Math.random()]
        },
        "properties": {
          "locations": [],
          "path": []
        }
      }
      data.features.push(newDriver)
      setDriversData([data])

      // coordinates": [103.8444503, 1.2785377]
    
  }
  
  function addTestData(){
    // setTestData(testData + 1)
    childRef.current.getRandomPoint()
  }
  function startendwaypoint(){
    childRef.current.getStartEndWaypoint()
  }
  const childRef = useRef();

  return (
    <div>
    <MapboxGLMap driversPosition={driversData} testData ={testData} waypointPosition={waypointPosition} ref={childRef}/>
    {/* <MapboxGLMap2 driversPosition={driversData} /> */}
    <button onClick={addNewDriver}>Add New Driver</button>
    <button onClick={addRandomCoordinates}>Add random coordinates</button>
    <button onClick={addTestData}>Get random point</button>
    <button onClick={startendwaypoint}>Get start,end, wapoints</button>
    <button onClick={() => dispatch(increment([1]))}>Add marker</button>
    <button onClick={addMarker}>Move marker</button>
    <button onClick={displayRoads}>Display roads</button>
    <button onClick={intializeOrder}>Intialize order distributor</button>
    <button onClick={sendMessage}>Spawn Environment 1</button>
    <button onClick={sendMessage2}>Spawn Environment 2</button>
    <button onClick={testMessage}>TestButton</button>
    </div>
  )
}

//<LeafletMap markersData={markersData} data={data} />
export default App;
