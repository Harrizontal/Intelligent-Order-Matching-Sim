import {combineReducers} from 'redux';
import {mapDrawReducer} from './drawmap'

export default combineReducers({
    mapDraw: mapDrawReducer
})