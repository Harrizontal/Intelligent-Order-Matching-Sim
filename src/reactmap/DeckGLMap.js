import React, {Component} from "react"
import DeckGL, { ScatterplotLayer ,PolygonLayer} from "deck.gl";
import { EditableGeoJsonLayer, DrawPolygonMode } from 'nebula.gl';
import { StaticMap } from "react-map-gl";
import { connect } from 'react-redux'

// Create a mapbox account, generate a token and put in here.
const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiaGFycml6b250YWwiLCJhIjoiY2tiMzRkb3I4MDJiejJ6bzZvM3U0eTBlbiJ9.JOOkeGelJapEFeoHPOINng";

// Coordinates are pointing to center of Chengdu, China.
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

// Constants of colours for status of the driver (roaming, picking up, etc)
const STATUS_COLOURS = {
    RED: [220, 20, 60], // crimison
    PURPLE: [138,43,226], // purple (blueviolet)
    BLUE: [30,144,255], // dodgerblue
    YELLOW: [204, 204, 0], // yellow (oliver)
    GREEN: [0, 128, 0], // green
    BLACK: [0,0,0] // black
};

// Contacts of colours for the virus
const VIRUS_COLOURS = {
    DRIVERS: {
        NONE: [0, 204, 102], // crimison
        MILD: [255,153,153], // purple (blueviolet)
        MODERATE: [255,51,51], // dodgerblue
        SEVERE: [102,0,0]
    },
    TASKS: {
        NONE: [0, 204, 102], // crimison
        MILD: [255,153,153], // purple (blueviolet)
        MODERATE: [255,51,51], // dodgerblue
        SEVERE: [102,0,0]
    }
};


function mapStateToProps(state) {
    return {
      mapSettings: state.mapSettings
    };
  }

class DeckGLMap extends Component {

    constructor(props){
        super(props);
        this.state = {
            drivers: [],
            environments: [],
            tasks: [],
            data: myFeatureCollection,
            tasks_colours: {},
            drivers_colours: {},
            polygon_colours: {}
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
    
    _renderTooltip() {
        const {hoveredType, hoveredObject, pointerX, pointerY} = this.state || {};

        switch(hoveredType){
            case 'driver':
                return hoveredObject && (
                    <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY}}>
                     <p style={{margin:0,padding:0}}><b>Driver {hoveredObject.properties.information.id} </b></p>
                    </div>
                  );
            case 'task':
                return hoveredObject && (
                    <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY}}>
                     <p style={{margin:0,padding:0}}><b>Task {hoveredObject.properties.information.id} </b></p>
                    </div>
                  );
            case null:
                return null;
        }
       
      }

    render (){
        const {mapSettings} = this.props;
        
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
                id: 'task-scatter-layer',
                data: this.state.tasks,
                pickable: true,
                opacity: 0.7,
                radiusMinPixels: 2,
                radiusMaxPixels: 10,
                getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
                getColor: d => {
                    switch(mapSettings.type){
                        case 1:
                            return STATUS_COLOURS.BLACK
                        case 2:
                            switch(d.properties.information.virus){
                                case 0: // roaming
                                    return VIRUS_COLOURS.TASKS.NONE
                                case 1: // matching
                                    return VIRUS_COLOURS.TASKS.MILD
                                case 2: // fetching
                                    return VIRUS_COLOURS.TASKS.MODERATE
                                case 3: // travelling
                                    return VIRUS_COLOURS.TASKS.SEVERE
                            }
                    }
                },
                getRadius: 2,
                onHover: info => this.setState({
                    hoveredType:"task",
                    hoveredObject: info.object,
                    pointerX: info.x,
                    pointerY: info.y
                  })
            }),
            new ScatterplotLayer({
                id: 'driver-scatter-layer',
                data: this.state.drivers,
                pickable: true,
                opacity: 0.8,
                radiusMinPixels: 3,
                radiusMaxPixels: 10,
                getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
                getColor: d => {
                    switch(mapSettings.type){
                        case 1:
                            switch(d.properties.information.status){
                                case 0: // roaming
                                    return STATUS_COLOURS.RED
                                case 1: // matching
                                    return STATUS_COLOURS.BLUE
                                case 2: // fetching
                                    return STATUS_COLOURS.YELLOW
                                case 3: // travelling
                                    return STATUS_COLOURS.GREEN
                                case 4:
                                    return STATUS_COLOURS.RED
                            }
                        case 2:
                            switch(d.properties.information.virus){
                                case 0: // roaming
                                    return VIRUS_COLOURS.DRIVERS.NONE
                                case 1: // matching
                                    return VIRUS_COLOURS.DRIVERS.MILD
                                case 2: // fetching
                                    return VIRUS_COLOURS.DRIVERS.MODERATE
                                case 3: // travelling
                                    return VIRUS_COLOURS.DRIVERS.SEVERE
                            }
                    }
                    
                },
                getRadius: 3,
                onHover: info => this.setState({
                    hoveredType:"driver",
                    hoveredObject: info.object,
                    pointerX: info.x,
                    pointerY: info.y
                  })
            }),
            new EditableGeoJsonLayer({
                id: 'geojson-layer',
                data: this.state.data,
                mode: DrawPolygonMode,
                selectedFeatureIndexes,
                onEdit: ({updatedData,editType})=>{
                    console.log(editType)

                    this.setState({
                        data: updatedData
                    })
                    if (editType == 'addFeature'){
                        this.clearData()
                    }
                    
                }
            })
        ]

        return (
            <div style={{width: "100%",height:"100%"}}>
                <DeckGL
                    style={{position:"relative"}}
                    width="100%"
                    height="100%"
                    initialViewState={initialViewState}
                    controller={true}
                    layers={layers}>
                    
                    <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}/>
                </DeckGL>
                { this._renderTooltip() }
            </div>
            
            
        )
    }
}

export default connect(mapStateToProps)(DeckGLMap)