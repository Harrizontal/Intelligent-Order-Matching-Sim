import React, { useState,useEffect } from "react";
import "./App.css";
import ReactMap from "./map/ReactMap";
import { Config } from "./Config";
import LeafletMap from "./map/LeafletMap";


// const TOKEN = Config.MAPBOX_API;
// const LONG = Config.LONG;
// const LAT = Config.LAT;
// const ZOOM = Config.ZOOM;
// const STYLE_ID = "ryantm/cj8m5f0136ll12sk7nm8dj00k";




function App() {
  const [markersData, setMarkersData] = useState([
    { latLng: { lat: 1.2808, lng: 103.8259 }, title: 1 }
  ]);

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
      console.log(evt.data)
      setData(evt.data)
      // 2,1,EnvironmentId,DriverId
      var response = JSON.parse("["+evt.data+"]")
      var eId = response[2] // environment Id
      var dId = response[3] // driver Id
      var randomPoint = [1.2774947,103.8460384]
      switch (response[0]){
        case 2:
          switch(response[1]){
            case 0: // random point
              var command = [2,0,eId,dId,randomPoint]
              var asd = JSON.stringify(command)
              ws.send(asd)
              break;
            case 1:
              // start, destination, and waypoint
              var command = [2,1,eId,dId,randomPoint,randomPoint,[randomPoint,randomPoint]]
              var asd = JSON.stringify(command)
              ws.send(asd)
              break;
            case 2: // pathway between two points
              console.log("Testing "+response[4][0])
              var command = [2,2,eId,dId,[randomPoint,randomPoint,randomPoint,randomPoint]]
              var asd = JSON.stringify(command)
              ws.send(asd)
              break;
            case 3: // create a node
              var command = [2,3,eId,dId,true]
              var asd = JSON.stringify(command)
              ws.send(asd)
              break;
            case 4:
              var command = [2,4,eId,dId,true]
              var asd = JSON.stringify(command)
              ws.send(asd)
              break;
          }
      }
      
    }
  }

  useEffect(() => {
    //console.log("UseEffect")
    if (ws == null){
      connect()
    }
  })


  // useEffect(()=>{
  //   if(ws == null){
  //     console.log("Set up websocket")
  //     let ws = new WebSocket('ws://localhost:8080/ws')
  //     setWebSocket(ws)
  //   }

  //   if (ws != null){
  //     ws.onopen = () => {
  //       console.log("connected")
        
  //     }
  
  //     ws.onmessage = evt => {
  //       console.log(evt.data)
  //       setData(evt.data)
  //     }
  
  //     ws.onclose = (event) => {
  //       console.log("Socket Closed Connection")
  //     } 
  //   }
    
  // });


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
    ws.send("[1,5]")
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

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <LeafletMap markersData={markersData} data={data} />
      <div>{data}</div>
      <button onClick={addMarker}>Move marker</button>
      <button onClick={displayRoads}>Display roads</button>
      <button onClick={intializeOrder}>Intialize order distributor</button>
      <button onClick={sendMessage}>Spawn Environment 1</button>
      <button onClick={sendMessage2}>Spawn Environment 2</button>
      <button onClick={testMessage}>TestButton</button>
    </div>
  );
}

export default App;
