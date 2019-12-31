import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { streetsToGraph } from "../mapultis/graphroads";
import {populateRoads2 } from "../mapultis/processroads"
import * as npath from 'ngraph.path'
import * as turf from '@turf/turf'
import {connect, useSelector} from 'react-redux'
import {useDeepEffect} from './useDeepEffect'
import * as _ from 'lodash'
const styles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "relative"
};

const MapboxGLMap = forwardRef((props,ref) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const {driversPosition, testData, waypointPosition} = props

  useImperativeHandle(ref, () => ({

    getAlert(){
      console.log(graphDict)
    },
    getRandomPoint(){
      var totalPoints = Object.keys(graphDict).length;
      var max = totalPoints - 1
      var randomPoint = Math.floor(Math.random() * (max - 0)) + 0
      console.log(Object.keys(graphDict)[randomPoint])
      return Object.keys(graphDict)[randomPoint]
    },
    getWaypoint(startingPoint,endingPoint){
      var waypoint = pathFinder.find(endingPoint,startingPoint)
      const coordinateWaypoint = waypoint.map(x => {
        var coordinates = x.id.split(',')
        return [parseFloat(coordinates[0]),parseFloat(coordinates[1])]
      })
      return coordinateWaypoint
    },
    getStartEndWaypoint(){
      var startingPoint = this.getRandomPoint()
      var endingPoint = this.getRandomPoint()
      var waypoint = pathFinder.find(endingPoint,startingPoint)
      if(waypoint.length == 0){
        return this.getStartEndWaypoint()
      }else{
        const coordinateWaypoint = waypoint.map(x => {
          var coordinates = x.id.split(',')
          return [parseFloat(coordinates[0]),parseFloat(coordinates[1])]
        })
        var starting = startingPoint.split(',')
        var startPoint = [parseFloat(starting[0]),parseFloat(starting[1])]
        var ending = endingPoint.split(',')
        var endPoint = [parseFloat(ending[0]),parseFloat(ending[1])]

        return [startPoint, endPoint, coordinateWaypoint]
      }
    },
    getEndWaypoint(startingPoint){
      var endingPoint = this.getRandomPoint()
      var waypoint = pathFinder.find(endingPoint,startingPoint)
      if(waypoint.length == 0){
        return this.getEndWaypoint(startingPoint)
      }else{
        const coordinateWaypoint = waypoint.map(x => {
          var coordinates = x.id
          var coord = coordinates.split(',')
          return [parseFloat(coord[0]),parseFloat(coord[1])]
        })
        var ending = endingPoint.split(',')
        var endPoint = [parseFloat(ending[0]),parseFloat(ending[1])]
        return [endPoint, coordinateWaypoint]
      }
    }
  }))

  // initialize map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGFycml6b250YWwiLCJhIjoiY2l6YWw3YW90MDQ1NzJ3cDl5bXd4M2Y4aSJ9.CnTz5K2ShZcuLiG0xYLBKw";
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11?optimize=true", // stylesheet location
        center: [103.8259,1.2808],
        zoom: 14
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  // initialize graph
  const [graphDict,setGraphDict] = useState(null)
  const [pathFinder,setPathFinder] = useState(null)
  useEffect(() => {
    if ( map != null && graphDict == null){
        var data = require("../map/singapore1.json")
        let streets = populateRoads2(data,map)
        var streetsGraph = streetsToGraph(streets)
        var graphDict = {}
        streetsGraph.forEachNode(function(node){
        graphDict[node.id] = 1
        });
        console.log(graphDict)
        setGraphDict(graphDict)

        let pathFinder = npath.aStar(streetsGraph)
        setPathFinder(pathFinder)
        let foundPath = pathFinder.find('1.2787672,103.8444549','1.2741305,103.8430676')
        console.log(foundPath)
    }
  },[map])

  //driverPositions
  useEffect(() => {
    //console.log("useEffect driversPosition")
    if(map){
        if(!map.getSource('point')){
          console.log("Intializing new source")
          var data = driversPosition[0]
          map.addSource('point',{
            type: 'geojson',
            data: data,
            buffer: 10
          });
    
          // map.addLayer({
          //   'id': 'point',
          //   'type': 'circle',
          //   'source': 'point',
          //   'paint': {
          //     'circle-radius': 5,
          //     'circle-color': ['match',
          //     ['get','type'],
          //     'Driver',
          //     '#0687f5',
          //     'Task',
          //     '#921dde',
          //     '#53565d'
          //     ]
          //   }
          // })

          // map.addLayer({
          //   'id': 'point',
          //   'type': 'circle',
          //   'source': 'point',
          //   'paint': {
          //     'circle-radius': 5,
          //     'circle-color': 
          //     ['match',["to-number",['get','status']],0,'#0687f5','#F50606'],
          //   }
          // })

          map.addLayer({
            'id': 'point',
            'type': 'circle',
            'source': 'point',
            'paint': {
              'circle-radius': 5,
              'circle-color': 
              ['match',['get','status',['get','information']],
                0,
                'red',
                1,
                'blue',
                2,
                'yellow',
                3,
                'yellow',
                'black'
              ],
            }
          })


          //['match',['string',['get','status']],'0','#0687f5','1','#F2AF1E','2','#18A927','3','#0D7618','#3F33FF']
          // map.addLayer({
          //   'id': 'point',
          //   'type': 'circle',
          //   'source': 'point',
          //   'paint': {
          //     'circle-radius': 5,
          //     'circle-color': 
          //     ['case',
          //       ['==',['get',"type"], "Driver"],
          //       ['match',['to-number',['get','status']],
          //         0,
          //         'red',
          //         1,
          //         'green',
          //         2,
          //         'yellow',
          //         3,
          //         '#0D7618',
          //         '#3F33FF'
          //       ], 
          //       ['==',['get',"type"], "Task"],
          //       '#921dde', 
          //       ['==',['get',"type"], "Point"],
          //       '#000000',
          //       '#000000'
          //     ],
          //   }
          // })

        }else{
          //console.log("Update new point")
          map.getSource('point').setData(driversPosition[0])
        }
    
    }
  },[driversPosition])

  // var currentMarkers=[];
  // useEffect(()=>{
  //   if (waypointPosition.length > 0) {
  //     for (var i = 0; i < currentMarkers.length; i++){
  //       currentMarkers[i].remove()
  //     }
  //     waypointPosition.map((lnglat) => {
  //       var marker = new mapboxgl.Marker();
  //       currentMarkers.push(marker)
  //       marker.setLngLat({lng:lnglat[1], lat:lnglat[0]})
  //       marker.addTo(map)
  //     })
  //   }
  // },[waypointPosition])


  // useEffect(() => {
  //   console.log("test data changed")
  //   console.log(driversPosition[0].features.length)
  //   if (map){
  //     map.addSource('point',{
  //       type: 'geojson',
  //       data: driversPosition[0],
  //       buffer: 5
  //     });
  
  //     map.addLayer({
  //       id: 'point',
  //       type: 'circle',
  //       source: 'point',
  //       paint: {
  //         'circle-radius':5,
  //         'circle-color': 'blue',
  //         'circle-stroke-width':1,
  //         'circle-stroke-color':'white'
  //       }
  //     })
  //   }
    
  // },[driversPosition])
  // var marker = new mapboxgl.Marker();

  // function addMovingMarker(){
  //   requestAnimationFrame(animateMarker)

  // }

  // function animateMarker(timestamp){
  //   var radius = 20;
  //   marker.setLngLat([Math.cos(timestamp/ 1000) * radius, Math.sin(timestamp / 1000) * radius])
  //   marker.addTo(map);

  //   requestAnimationFrame(animateMarker)
  // }


  // var point = {
  //   'type': 'FeatureCollection',
  //   'features': [{
  //     'type': 'Feature',
  //     'properties': {},
  //     'geometry': {
  //       'type': 'Point',
  //       'coordinates': origin
  //     }
  //   }]
  // }
  // var steps = 50
  // var counter = 0;
  // var marker = new mapboxgl.Marker();
  // const [arc,setArc] = useState(null)
  
  
  // useEffect(() => {
  //   var origin = [103.8430676,1.2741305];
  //   var destination = [103.8444503, 1.2785377];
  //   var lineDistance = turf.distance(origin,destination,{units: 'meters'});
  //     var arc = []
  //     for (var i = 0; i < lineDistance; i += lineDistance / steps) {
  //       var segment = turf.along(turf.lineString([origin,destination]), i, {units: 'meters'});
  //       arc.push(segment.geometry.coordinates);
  //     }
  //     arc.push(destination)
  //     setArc(arc)
  // },[])


  // function moveMarker(){
  //   console.log(counter + ":" +arc[counter])
    
  //   if (counter < steps + 1){
  //     marker.setLngLat([arc[counter][0],arc[counter][1]])
  //     marker.addTo(map)
  //     requestAnimationFrame(moveMarker)
  //   }
  //   counter = counter + 1

  // }

  // function fakeDrivers(){
  //   // let source = map.getSource("point")._data
  //   // let features = source.features; 
  //   // console.log(source)
  //   //   console.log(features)

  //   let driversFeatures = driversPosition.features
  //     driversFeatures.forEach((value,index) => {
  //       value.geometry.coordinates[0] = value.geometry.coordinates[0] - 0.001
  //       value.geometry.coordinates[1] = value.geometry.coordinates[1] - 0.001
  //     })
      
  //   console.log(driversPosition.features)
    

  //   if (map){
  //     map.getSource("point").setData(driversPosition)
  //   }
  //   requestAnimationFrame(fakeDrivers)
  // }

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }


  return (
    <div>
      <div ref={el => (mapContainer.current = el)} style={styles} />
      <ol>
        {driversPosition[0].features.map(feature => {
          switch(feature.properties.type){
            case 'Driver':
              return <li>Driver {feature.properties.information.id}, Status: {feature.properties.information.status}, CurrentTask: {feature.properties.information.current_task_id}</li>
            case 'Task':
              return <li>Task {feature.properties.information.id}, Status: {feature.properties.information.status}</li>
          }
        })
        }
      </ol>
      {/* <button onClick={moveMarker}>Moving button</button> */}
    </div>
  )
  
})

export default MapboxGLMap;
