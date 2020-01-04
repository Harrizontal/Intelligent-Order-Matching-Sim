import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { streetsToGraph } from "../mapultis/graphroads";
import {populateRoads2 } from "../mapultis/processroads"
import * as npath from 'ngraph.path'
import * as turf from '@turf/turf'
import {connect, useSelector} from 'react-redux'
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
  const {driversPosition, polygonData, testData, waypointPosition} = props
  const draw = useRef(null)
  const [graphDict,setGraphDict] = useState(null)
  const pathFinder = useRef(null)
  const quadtree = useRef(null)

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
      var mapboxDraw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        }
      });
      draw.current = mapboxDraw
      map.addControl(mapboxDraw)

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
    console.log(draw.current.getAll())
  }

  
  // initialize graph
  
  useEffect(() => {
    if ( map != null && graphDict == null){
        var qtree = d3.quadtree()
        var data = require("../map/singapore1.json")
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
        console.log(graphDict)
        setGraphDict(graphDict)

        pathFinder.current = npath.aStar(streetsGraph)
        let foundPath = pathFinder.current.find('1.2787672,103.8444549','1.2741305,103.8430676')
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
          });

          //TODO: put into another function
          map.addLayer({
            'id': 'environment2',
            'type': 'fill',
            'source': 'point',
            'paint': {
              'fill-color': '#888888',
              'fill-opacity': 0.4
            },
            'filter': ['==', '$type', 'Polygon']
          })

          map.addLayer({
            'id': 'driver',
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

          
        }else{
          //console.log("Update new point")
          map.getSource('point').setData(driversPosition[0])
        }
    
    }
  },[driversPosition])

  useEffect(() => {
    //console.log("useEffect driversPosition")
    if(map){
        if(!map.getSource('env')){
          console.log("Intializing new source polygon")
          var data = polygonData[0]
          map.addSource('env',{
            type: 'geojson',
            data: data,
          });

        
          map.addLayer({
            'id': 'environment2',
            'type': 'fill',
            'source': 'env',
            'paint': {
              'fill-color': 'red',
              'fill-opacity': 0.8
            },
            'filter': ['==', '$type', 'Polygon']
          })
          
        }else{
          map.getSource('env').setData(polygonData[0])
        }
    }
  },[polygonData])

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
    <div>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <div ref={el => (mapContainer.current = el)} style={styles} />
        </Grid>
        <Grid item xs={4}>
        <Display data={driversPosition}/>
        </Grid>
      </Grid>
      
      
    </div>
  )
  
})

export default MapboxGLMap;
