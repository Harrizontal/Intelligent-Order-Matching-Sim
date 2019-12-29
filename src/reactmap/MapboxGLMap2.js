import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import fakedrivers from "./fakedriver.json"
import * as turf from '@turf/turf'

const styles = {
    width: "100vw",
    height: "calc(100vh - 80px)",
    position: "relative"
  };

class MapboxGLMap2 extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            lng: 103.8259,
            lat: 1.2808,
            zoom: 13,
            map: null,
            drivers: null
        }
    }

    componentDidMount(){
        mapboxgl.accessToken =
      "pk.eyJ1IjoiaGFycml6b250YWwiLCJhIjoiY2l6YWw3YW90MDQ1NzJ3cDl5bXd4M2Y4aSJ9.CnTz5K2ShZcuLiG0xYLBKw";
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng,this.state.lat],
            zoom: this.state.zoom
        })
        this.setState({map: map})
        map.on("load",() => {
            map.addSource("point",{
                type:"geojson",
                data: fakedrivers,
                buffer: 5
            })

            //this.setState({drivers: fakedrivers})
            console.log(this.state.drivers)
            map.addLayer({
                id: 'point',
                type: 'circle',
                source: 'point',
                paint: {
                  'circle-radius':5,
                  'circle-color': 'blue',
                  'circle-stroke-width':1,
                  'circle-stroke-color':'white'
                }
              })


            }
        )
    }

    animate = () => {
        const {map,drivers} = this.state
        let source = map.getSource('point')._data;
        let features = source.features;
        console.log(drivers)
        var run = false;
        features.forEach((driver,index) => {
            console.log(driver)
            if(driver.properties.path[0] != null){
                driver.geometry.coordinates = driver.properties.path[0]
                driver.properties.path.shift()
                console.log(driver)
                run = true
            }
        })
        map.getSource('point').setData(source)
        if (run == true){
            console.log("run")
            requestAnimationFrame(this.animate)
        }
        
    }

    calculatePath = (origin, destination) => {
        console.log("calculating path")
        var steps = 10
        // var origin = [103.8430676,1.2741305];
        // var destination = [103.8444503, 1.2785377];
        console.log(origin)
        console.log(destination)
        var lineDistance = turf.distance(origin,destination,{units: 'meters'});
        console.log(lineDistance)
        var arc = []
        for (var i = 0; i < lineDistance; i += lineDistance / steps) {
            var segment = turf.along(turf.lineString([origin,destination]), i, {units: 'meters'});
            arc.push(segment.geometry.coordinates);
        } 
        arc.push(destination)
        return arc
    }

    UNSAFE_componentWillReceiveProps(nextProps, prevProps){
        const {map} = this.state
        let newData = nextProps
        
        if(map.getSource('point')){
            console.log(this.state.drivers)
            console.log(newData)
            map.getSource('point').setData(newData.driversPosition[0])
        }
        // if(map.getSource('point')){
        //     newData.features.map((feature,index) => {
        //         // console.log(drivers.features[index].properties.locations)
        //         // console.log(feature.geometry.coordinates)
        //         drivers.features[index].properties.locations.push(feature.geometry.coordinates)
        //         drivers.features[index].properties.path = this.calculatePath(drivers.features[index].geometry.coordinates,feature.geometry.coordinates)
        //     })
        //     this.setState({drivers: drivers})
            
        //     //window.requestAnimationFrame(this.animate)
        // }
    }

    render() {
        return (
            <div>
                <div ref={el => this.mapContainer = el} style={styles}/>
            </div>
        )
    }
}

export default MapboxGLMap2
