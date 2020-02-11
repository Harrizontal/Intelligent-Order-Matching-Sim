import React, {Component} from "react"
import DeckGL, { IconLayer,LineLayer,ScatterplotLayer } from "deck.gl";
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
            airplanes: [],
            viewport: {},
            drivers: [],
            data: myFeatureCollection
        }
    }

    UNSAFE_componentDidMount(){
        console.log("componentDidMount")
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        //console.log("componentWillReceiveProps", nextProps);
        console.log(nextProps.driversData[0].features)
        this.setState({
            drivers: nextProps.driversData[0].features
        })
    }

    // fetchData = () =>{
    //     console.log("fetching data")
    //     d3.json("https://opensky-network.org/api/states/all").then(
    //         ({states}) => 
    //             this.setState({
    //                 airplanes: states.map(d => ({
    //                     callsign: d[1],
    //                     longitude: d[5],
    //                     latitude: d[6],
    //                     velocity: d[9],
    //                     altitude: d[13],
    //                     origin_country: d[2],

    //                 }))
    //             })
    //     );
    //     setTimeout(this.fetchData, 10*1000)
    // }

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
            new ScatterplotLayer({
                id: 's-a',
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