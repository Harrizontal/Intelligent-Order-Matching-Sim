import mapboxgl from "mapbox-gl";
const initialState = {
};

export const markerReducer = (state = [], action) => {
    switch(action.type){
        case 'ADD_MARKER':
            var marker = new mapboxgl.Marker();
            return [...state,action.payload];
        case 'DELETE_MARKER':
            return [...state,action.payload];
        default:
            return state
    }
}