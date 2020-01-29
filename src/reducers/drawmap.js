
const initialState = {
};

export const drawMapReducer = (state = {num: 0, polygon_coordinates: null}, action) => {
    switch(action.type){
        case 'CREATED_POLYGON':
            return null
        case 'INCREMENT':
            return {
                ...state,
                num: state.num + action.step,
                polygon_coordinates: action.payload
            }
        case 'DECREMENT':
            return {
                ...state,
                num: state.num - action.step,
                polygon_coordinates: null
            }
        default:
            return state
    }
}

export const mapDrawReducer = (state = {mapDraw: null, polygon_coordinates: null}, action) => {
    switch(action.type){
        case 'SET_MAP_DRAW':
            console.log(action.payload)
            return {
                ...state,
                mapDraw: action.payload
            }
        case 'SET_POLYGON':
            return {
                ...state,
                polygon_coordinates: action.polygon_coordinates
            }
        case 'DELETE_POLYGON':
            console.log(state.mapDraw)
            state.mapDraw.deleteAll()
            return {
                ...state,
                polygon_coordinates: null
            }
        default:
            return state
    }
}