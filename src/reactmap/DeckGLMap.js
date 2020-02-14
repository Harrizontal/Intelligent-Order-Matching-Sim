import React, {Component} from "react"
import DeckGL, { IconLayer,LineLayer,ScatterplotLayer ,PolygonLayer} from "deck.gl";
import { EditableGeoJsonLayer, DrawPolygonMode } from 'nebula.gl';
import { StaticMap } from "react-map-gl";
import * as d3 from "d3"
import { connect } from 'react-redux'

const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiaGFycml6b250YWwiLCJhIjoiY2l6YWw3YW90MDQ1NzJ3cDl5bXd4M2Y4aSJ9.CnTz5K2ShZcuLiG0xYLBKw";


const initialViewState = {
    longitude: 104.053993,
    latitude: 30.684104,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    width: 400,
    height: 400
};

const myFeatureCollection = {
    type: 'FeatureCollection',
    features: []
}

const selectedFeatureIndexes = [];


const COLOURS = {
    RED: [220, 20, 60], // crimison
    PURPLE: [138,43,226], // purple (blueviolet)
    BLUE: [30,144,255], // dodgerblue
    YELLOW: [204, 204, 0], // yellow (oliver)
    GREEN: [0, 128, 0], // green
    BLACK: [0,0,0] // black
};

class DeckGLMap extends Component {

    constructor(props){
        super(props);
        this.state = {
            drivers: [],
            environments: [],
            tasks: [],
            data: myFeatureCollection
        }
    }

    UNSAFE_componentDidMount(){
        console.log("componentDidMount")
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps", nextProps);
        //console.log(nextProps.driversData[0].features)
        this.setState({
            drivers: nextProps.driversData.features  ? nextProps.driversData.features : [],
            environments: nextProps.envsData.features ? nextProps.envsData.features: [],
            tasks: nextProps.tasksData.features ? nextProps.tasksData.features: []
        })
    }


    clearData = () => {
        const {dispatch} = this.props;
        console.log(this.state.data)
       
            dispatch({
                type: "SET_POLYGON",
                polygon_coordinates: this.state.data.features[0].geometry.coordinates[0]
            })
        
        

        this.setState({
            data: myFeatureCollection
        })
    }
    

    render (){
        const layers = [
            new PolygonLayer({
                id: 'polygon-layer',
                data: this.state.environments,
                pickable: true,
                stroked: true,
                filled: true,
                wireframe: true,
                lineWidthMinPixels: 1,
                getPolygon: d => d.geometry.coordinates,
                getElevation: d => 3,
                getFillColor: d => [60, 140, 0,0],
                getLineColor: [0, 0, 0,80],
                getLineWidth: 2
            }),
            new ScatterplotLayer({
                id: 'driver-scatter-layer',
                data: this.state.tasks,
                pickable: false,
                opacity: 0.7,
                radiusMinPixels: 2,
                radiusMaxPixels: 15,
                getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
                getColor: COLOURS.BLACK,
                getRadius: 2
            }),
            new ScatterplotLayer({
                id: 'task-scatter-layer',
                data: this.state.drivers,
                pickable: false,
                opacity: 0.8,
                radiusMinPixels: 3,
                radiusMaxPixels: 20,
                getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
                getColor: d => {
                    switch(d.properties.information.type){
                        case 'Driver':
                            switch(d.properties.information.status){
                                case 0: // roaming
                                    return COLOURS.RED
                                case 1: // matching
                                    return COLOURS.BLUE
                                case 2: // fetching
                                    return COLOURS.YELLOW
                                case 3: // travelling
                                    return COLOURS.GREEN
                                case 4: // allocating
                                    return COLOURS.RED 
                            }
                        case 'Task':
                            return COLOURS.BLACK
                    }
                    
                },
                getRadius: 3
            }),
            new EditableGeoJsonLayer({
                id: 'geojson-layer',
                data: this.state.data,
                mode: DrawPolygonMode,
                selectedFeatureIndexes,
                onEdit: ({updatedData})=>{
                    this.setState({
                        data: updatedData
                    })
                }
            })
        ]

        // const layers = [
        //     new ScatterplotLayer({
        //         id: 's-a',
        //         data: this.state.airplanes,
        //         pickable: false,
        //         opacity: 0.8,
        //         radiusMinPixels: 5,
        //         radiusMaxPixels: 100,
        //         getPosition: d => [d.longitude, d.latitude],
        //         getColor: d => [255,140,0],
        //         getRadius: 5
        //     }),
        //     new EditableGeoJsonLayer({
        //         id: 'geojson-layer',
        //         data: this.state.data,
        //         mode: DrawPolygonMode,
        //         selectedFeatureIndexes,
        //         onEdit: ({updatedData})=>{
        //             this.setState({
        //                 data: updatedData
        //             })
        //         }
        //     })
        // ]

        return (
            <div style={{width: "100%",height:"100%"}}>
                <DeckGL
                    style={{position:"relative"}}
                    width="100%"
                    height="90%"
                    initialViewState={initialViewState}
                    controller={true}
                    layers={layers}
                >
                    <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}/>
                </DeckGL>
                <a href="#" onClick={this.clearData} style={{zIndex: 5}}>Clear polygon</a>
            </div>
            
            
        )
    }
}

export default connect()(DeckGLMap)