import {combineReducers} from 'redux';
import {markerReducer} from './marker'

export default combineReducers({
    markerStuff: markerReducer
})