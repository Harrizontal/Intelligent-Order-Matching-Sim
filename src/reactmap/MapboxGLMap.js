import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { streetsToGraph } from "../mapultis/graphroads";
import {populateRoads2 } from "../mapultis/processroads"
import * as npath from 'ngraph.path'
import * as turf from '@turf/turf'
import {connect, useSelector, useDispatch} from 'react-redux'
import * as _ from 'lodash'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as d3 from "d3";


const styles = {
  width: "100%",
  height: "70vh",
  position: "relative"
};

const MapboxGLMap = forwardRef((props,ref) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const {driversData, envData, taskData, waypointPosition} = props
  const draw = useRef(null)
  const [graphDict,setGraphDict] = useState(null)
  const pathFinder = useRef(null)
  const quadtree = useRef(null)
  const dispatch = useDispatch();

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
      var waypoint = pathFinder.current.find(endingPoint,startingPoint)
      const coordinateWaypoint = waypoint.map(x => {
        var coordinates = x.id.split(',')
        return [parseFloat(coordinates[0]),parseFloat(coordinates[1])]
      })
      return coordinateWaypoint
    },
    getDistance(startingPoint,endingPoint){
      var waypoint = pathFinder.current.find(endingPoint,startingPoint)
      var distance = getDistance(waypoint)
      return distance
    },
    getStartEndWaypoint(){
      var startingPoint = this.getRandomPoint()
      var endingPoint = this.getRandomPoint()
      var waypoint = pathFinder.current.find(endingPoint,startingPoint)
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
      var waypoint = pathFinder.current.find(endingPoint,startingPoint)
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
    },
    getNearestNode(lng,lat){
      let node = quadtree.current.find(lng,lat) // return string lng,lat
      return node
    },
    resetMap(){
      if(map != null){
        if(map.getSource('env')){
          map.removeLayer('env-layer')
          map.removeSource('env')
          
        }

        if(map.getSource('driver')){
          map.removeLayer('driver-layer')
          map.removeSource('driver')
         
        }

        if(map.getSource('task')){
          map.removeLayer('task-layer')
          map.removeSource('task')
          
        }

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
        center: [104.053993,30.684104], // [104.053993,30.684104] [103.8259,1.2808]
        zoom: 10.5
      });
      var mapboxDraw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        }
      });
      draw.current = mapboxDraw
      map.addControl(mapboxDraw)

      dispatch({
        type: "SET_MAP_DRAW",
        payload: mapboxDraw,
      })
      
      map.on('draw.create', updateArea);
      map.on('draw.delete', updateArea);
      map.on('draw.update', updateArea);

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  function updateArea(e){
    // console.log(draw.current)
    console.log(draw.current.getAll())
    

    let geojson = draw.current.getAll()
    //console.log(geojson.features[0].geometry.coordinates)
    switch(geojson.features.length){
      case 0:
        dispatch({
          type: "DELETE_POLYGON",
          polygon_coordinates: null,
        })
        break
      case 1:
        console.log(geojson.features[0].geometry.coordinates)
        dispatch({
          type: "SET_POLYGON",
          polygon_coordinates: geojson.features[0].geometry.coordinates[0]
        })
        break
    }

  }

  
  // initialize graph
  
  useEffect(() => {
    if ( map != null && graphDict == null){
        var qtree = d3.quadtree()
        var data = require("../map/lol.json")
        let streets = populateRoads2(data,map)
        var streetsGraph = streetsToGraph(streets)
        var graphDict = {}
        streetsGraph.forEachNode(function(node){
          // streetsgraphs' nodes are in lat,lng format...
          let coordinate = node.id.split(",") 
          graphDict[node.id] = 1
          qtree.add([coordinate[1],coordinate[0]])
        });
        quadtree.current = qtree
        console.log(quadtree.current)
        console.log(graphDict) // lat lng format
        setGraphDict(graphDict)

        pathFinder.current = npath.aStar(streetsGraph)

    }
  },[map])

  function getDistance(arrayNodes){
    let distanceArray = 0
    for (let k = 0; k < arrayNodes.length - 1; k++){
      var node = arrayNodes[k]
      var node1 = arrayNodes[k].id
      var node2 = arrayNodes[k + 1].id
      for (let f = 0; f < node.links.length; f++){
        var link = node.links[f]
        if ((link.fromId == node1 && link.toId == node2) || (link.fromId == node2 && link.toId == node1)){
          distanceArray = distanceArray + link.data.distance
        }
      }
    }
    //console.log(distanceArray)
    return distanceArray
  }

  useEffect(() => {
    if(pathFinder.current != null){
      console.log(pathFinder.current)
      let foundPath = pathFinder.current.find('30.6978248,104.0708831','30.6879967,104.0546328')
      console.log(foundPath)
    } 
  },[pathFinder])


  useEffect(() => {
    if(map){
        if(!map.getSource('env')){
          console.log("Intializing new source polygon")
          var data = envData[0]
          map.addSource('env',{
            type: 'geojson',
            data: data,
          });

          map.addLayer({
            'id': 'env-layer',
            'type': 'fill',
            'source': 'env',
            'paint': {
              'fill-color': '#888888',
              'fill-opacity': 0.2
            },
            'filter': ['==', '$type', 'Polygon']
          })
          
        }else{
          map.getSource('env').setData(envData[0])
        }
    }
  },[envData])

  
  useEffect(() => {
    //console.log("useEffect driversPosition")
    if(map){
        if(!map.getSource('driver')){
          console.log("Intializing new source for drivers data")
          var data = driversData[0]
          map.addSource('driver',{
            type: 'geojson',
            data: data,
          });

          map.addLayer({
            'id': 'driver-layer',
            'type': 'circle',
            'source': 'driver',
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
                'green',
                4,
                'red', // purple colour #6a0dad
                'black'
              ],
            },
            'filter': ['==', '$type', 'Point']
          })

          // map.addLayer({
          //   'id': 'driver',
          //   'type': 'circle',
          //   'source': 'point',
          //   'paint': {
          //     'circle-radius': 5,
          //     'circle-color': 
          //     ['match',['get','environment_id',['get','information']],
          //       0,
          //       'red',
          //       1,
          //       'blue',
          //       2,
          //       'yellow',
          //       3,
          //       'yellow',
          //       'black'
          //     ],
          //   },
          //   'filter': ['==', '$type', 'Point']
          // })
          
          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });

          map.on('mouseenter','driver-layer',function(e){
            //console.log(e.features[0].geometry.coordinates)
            var infoObject = JSON.parse(e.features[0].properties.information)
            // console.log(infoObject.id)
            // console.log(JSON.parse(e.features[0].properties.information))
            var taskId;
            if (infoObject.id != undefined){
              taskId = 'DriverId:'+infoObject.id + '<br>' + 
                        'EnvId:'+infoObject.environment_id + '<br>'+
                        'CurrentTask:'+infoObject.current_task_id
            }

            var cord = e.features[0].geometry.coordinates.slice()
            popup
              .setLngLat(cord)
              .setHTML(taskId)
              .addTo(map);
          })

          map.on('mouseleave', 'driver-layer', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
          });
         
          
        }else{
          //console.log("Update new point")
          map.getSource('driver').setData(driversData[0])
        }
    
    }
  },[driversData])

  useEffect(() => {
    if(map){
        if(!map.getSource('task')){
          console.log("Intializing new source polygon")
          var data = taskData[0]
          map.addSource('task',{
            type: 'geojson',
            data: data,
          });

          map.addLayer({
            'id': 'task-layer',
            'type': 'circle',
            'source': 'task',
            'paint': {
              'circle-radius': 5,
              'circle-color': 'black',
            },
            'filter': ['==', '$type', 'Point']
          })

          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });

          map.on('mouseenter','task-layer',function(e){
            //console.log(e.features[0].geometry.coordinates)
            var infoObject = JSON.parse(e.features[0].properties.information)
            // console.log(infoObject.id)
            // console.log(JSON.parse(e.features[0].properties.information))
            var taskId;
            if (infoObject.id != undefined && infoObject.value != undefined){
              taskId = 'Id:'+infoObject.id + '<br>' + 
                      'Value: '+infoObject.value + '<br>' +
                      'Distance: '+infoObject.distance
            }else{
              taskId = infoObject.id
            }
            var cord = e.features[0].geometry.coordinates.slice()
            popup
              .setLngLat(cord)
              .setHTML(taskId)
              .addTo(map);
          })

          map.on('mouseleave', 'task-layer', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
          });
          
        }else{
          map.getSource('task').setData(taskData[0])
        }
    }
  },[taskData])

  const Display = props => {
    if (props.data != null && props.data[0].features.length > 0){
      var sorted = _.sortBy(props.data[0].features,['environment_id'],['id'])
      //console.log(sorted)
      return (
        <ol>
        {sorted.map(feature => {
          switch(feature.properties.type){
            case 'Driver':
              return <li>Env:{feature.properties.information.environment_id}, DriverId:{feature.properties.information.id}, Status: {feature.properties.information.status}, CurrentTask: {feature.properties.information.current_task_id}</li>
            case 'Task':
              return <li>Env:{feature.properties.information.environment_id} Task {feature.properties.information.id}, Status: {feature.properties.information.status}</li>
          }
        })
        }
      </ol> 
      )
     
    }else{
      return <div>no data</div>
    }
    
  }

  return (
         <div ref={el => (mapContainer.current = el)} style={styles} />
  )
  
})

export default MapboxGLMap;
