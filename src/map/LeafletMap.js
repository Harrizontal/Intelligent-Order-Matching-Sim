import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import styled from "styled-components";
import { streetsToGraph } from "../mapultis/graphroads";
import { getStreetFeatures,addStreetLayerIntersections, populateRoads } from "../mapultis/processroads"
import * as turf from '@turf/turf'
import * as ngraph from 'ngraph.graph'
import * as npath from 'ngraph.path'
import Papa from 'papaparse'
import * as d3 from "d3";

const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
`;

function LeafletMap({ markersData,data }) {
  
  const [rows,setRow] = useState([]);
  useEffect(() => {
    async function getData(){
      const response = await fetch('/order.csv')
      const reader = response.body.getReader()
      const result = await reader.read()
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value)
      const results = Papa.parse(csv,{header: false})
      const rows = results.data
      setRow(rows)
    }
    getData()
  },[])

  
  const mapRef = useRef(null);
  useEffect(() => {
    mapRef.current = L.map("map", {
      center: [1.2808, 103.8259],
      zoom: 4,
      layers: [
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGFycml6b250YWwiLCJhIjoiY2l6YWw3YW90MDQ1NzJ3cDl5bXd4M2Y4aSJ9.CnTz5K2ShZcuLiG0xYLBKw', {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });
  }, []);

  // add layer
  const layerRef = useRef(null);
  useEffect(() => {
    layerRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  const [graph, setGraph] = useState(null)
  useEffect(() => {
    
    layerRef.current.clearLayers();
    // markersData.forEach(marker => {
    //   L.marker(marker.latLng, { title: marker.title }).addTo(layerRef.current);
    // });

    if (graph == null){
      
    }
    var test = require("./singapore1.json");
    let streets = populateRoads(test,layerRef.current)
    //let streets = L.geoJSON(street_feature_collection, default_options)
    
    //Map streets' OSM IDs to their Leaflet IDs.
    // let id_map = {};

    // // // find intersections between all roads
    // streets.eachLayer(function(street) {
    //   id_map[street.feature.id] = street._leaflet_id;
    //   addStreetLayerIntersections(street,streets);
    // }, this);

    // // converts streets into graph.
    var streetsGraph = streetsToGraph(streets)

    // for testing - display nodes in map
    // var group = new L.LayerGroup();
    // streetsGraph.forEachNode(function(node){
    //   let coordinate = node.id.split(",")
    //   let latLng = {
    //     lat: coordinate[0], // y (horizontal)
    //     lng: coordinate[1] // x (vertical)
    //   }
    //   var circleMarker = new L.CircleMarker(latLng,{fillColor: 'blue', fillOpacity: 0.5, stroke: false})
    //   group.addLayer(circleMarker)
    // })
    // group.addTo(layerRef.current)
    // end of testing


    // --- do not delete ------
    // var quadtree = d3.quadtree()
    // streetsGraph.forEachNode(function(node){
    //   let coordinate = node.id.split(",")
    //   let latLng = {
    //     lat: coordinate[0], // y (horizontal)
    //     lng: coordinate[1] // x (vertical)
    //   }
    //   quadtree.add([latLng.lng,latLng.lat])
    // })

    // // display didi order on map
    // var group = new L.LayerGroup();
    // for (let k = 0; k < rows.length / 9; k++){
      
    //   if (rows[k][5] != undefined && rows[k][6] != undefined){
    //     var lng = rows[k][5];
    //     var lat = rows[k][6];
    //     var foundCoordinate = quadtree.find(lng,lat) // find closest node

    //     let latLng = {
    //       lat: foundCoordinate[1],
    //       lng: foundCoordinate[0]
    //     }
    //     var circleMarker = new L.CircleMarker(latLng,{fillColor: 'blue', fillOpacity: 0.5, stroke: false})
    //     group.addLayer(circleMarker)
    //   }
    //   group.addTo(layerRef.current)
    // }
    // ---- do not delete --- 

    // --- do not delete --> path ---- 
    let pathFinder = npath.aStar(streetsGraph)
    let foundPath = pathFinder.find('1.2770392,103.846895','1.2774947,103.8460384')
    console.log(foundPath)

    var group = new L.LayerGroup();
    for (let k = 0; k < foundPath.length; k++){
      let path = foundPath[k].id.split(",")
      let latLng = {
        lat: path[0],
        lng: path[1]
      }
      //L.marker(latLng, { title: "test",riseOnHover:true }).addTo(layerRef.current);
      var circleMarker = new L.CircleMarker(latLng,{fillColor: 'blue', fillOpacity: 0.5, stroke: false})
      group.addLayer(circleMarker)
    }
    group.addTo(layerRef.current)

    // --- do not delete --> path ---- 

  },[]);

  
  // useEffect(() => {
  //   console.log("asdasd")
  //   var svg = d3.select(mapRef.current.getPanes().overlayPane).append("svg");
  //   var g = svg.append(g).attr("class","leaflet-zoom-hide")

  //   d3.json("./points.geojson").then((data) => {
  //     var featuresdata = data.features.filter(function(d) {
  //       return d.properties.id == "route1"
  //     })

  //     const path = d3.geoTransform({point: projectPoint})

  //     console.log(featuresdata)

  //     const projectPoint = (x,y) => {
  //       var point = mapRef.current.latLngToLayerPoinr(new L.LatLng(y,x));
  //       this.stream.point(point.x,point.y)
  //     }
  //   })
  // },[])
  

  return <Wrapper width="1280px" height="720px" id="map" />;
}

export default LeafletMap;