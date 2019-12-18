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
  let ws = new WebSocket('ws://localhost:8080/ws')

  useEffect(()=>{
    ws.onopen = () => {
      console.log("connected")
      
    }

    ws.onmessage = evt => {
      console.log(evt.data)
      //ws.send("Hi from Client")
    }

    ws.onclose = (event) => {
      console.log("Socket Closed Connection")
    }
  });


  function displayRoads() {
    addMarker();
  }

  function sendMessage(){
    ws.send("Hi From Client")
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <LeafletMap markersData={markersData} />
      <button onClick={addMarker}>Move marker</button>
      <button onClick={displayRoads}>Display roads</button>
      <button onClick={sendMessage}>Spawn drivers</button>
    </div>
  );
}

export default App;
