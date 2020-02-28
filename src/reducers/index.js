import {combineReducers} from 'redux';
import {mapDrawReducer,mapSettingsReducer} from './drawmap'

export default combineReducers({
    mapDraw: mapDrawReducer,
    mapSettings: mapSettingsReducer
})