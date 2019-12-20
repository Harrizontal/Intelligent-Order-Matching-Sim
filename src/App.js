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
    console.log("Button pressed")
    ws.send("[1,10]")
  }

  function sendMessage2(){
    console.log("Button pressed")
    ws.send("[1,2]")
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
    </div>
  );
}

export default App;
