import L from "leaflet";
import {pointToCoordinateArray , encodeLatLng, leafetLatLngToPoint,convertPointsToMultiLine} from "./commonulti"
import * as turf from '@turf/turf'

export const populateRoads = (data,layerRef) => {
  let street_features = getStreetFeatures(data)
  let default_options = {
    color: "red",
    weight: 3,
    opacity: 0.5
  };

  let street_feature_collection = {
    type: "FeatureCollection",
    features: street_features
  };
  console.log(street_feature_collection)
  let streets = L.geoJSON(street_feature_collection, default_options)
  console.log(streets)
  streets.addTo(layerRef)
  let id_map = {};

  // find intersections between all roads
  streets.eachLayer(function(street) {
    id_map[street.feature.id] = street._leaflet_id;
    addStreetLayerIntersections(street,streets);
  });

  return streets
}

export const populateRoads2 = (data,map) => {
  let street_features = getStreetFeatures(data)
  let default_options = {
    color: "red",
    weight: 3,
    opacity: 0.5
  };

  let street_feature_collection = {
    type: "FeatureCollection",
    features: street_features
  };

  let streets = L.geoJSON(street_feature_collection, default_options)
    map.addLayer({
      'id': 'points',
      'type': 'line',
      'source': {
          'type': 'geojson',
          'data': street_feature_collection
      },
      'layout': {
          'line-cap': 'round',
          'line-join': 'round'
          },
      'paint': {
      'line-color': 'red',
      'line-width': 2
      }
  })

  let id_map = {};

  // find intersections between all roads
  streets.eachLayer(function(street) {
    id_map[street.feature.id] = street._leaflet_id;
    addStreetLayerIntersections(street,streets);
  });

  return streets
}
/**
 * Get all street features
 * @param {*} OSM_data 
 */
export const getStreetFeatures = OSM_data => {
    let street_features = [];
    let count = 0
    for (let i = 0; i < OSM_data.features.length; ++i) {
      let feature = OSM_data.features[i];
  
      if (feature.geometry.type === "LineString" && 
      (feature.properties.highway !== 'steps' && 
      feature.properties.highway !== 'footway' &&
      feature.properties.highway !== 'cycleway') && 
      feature.properties.highway) {
        // if(count == 20){
        //   break
        // }
        let street_feature = feature;
        count++
        street_features.push(street_feature);
      }
    }
    return street_features;
};

export const addStreetLayerIntersections = (street,streets) => {
    let street_id = street._leaflet_id;
    //console.log("-->adding intersection :" + street_id)
  
    street.intersections = typeof(street.intersections) === "undefined" ? {} : street.intersections;
    streets.eachLayer(function(other_street){
      let other_street_id = other_street._leaflet_id;
      if (typeof(street.intersections[other_street_id]) === "undefined" && street_id !== other_street_id) {
        let street_coords = street.getLatLngs().map(pointToCoordinateArray)
        let other_street_coords = other_street.getLatLngs().map(pointToCoordinateArray)
        //console.log("Comparing "+street.feature.id + " to "+other_street.feature.id)
        //console.log("Street_coords: "+ street_coords.length +" -> "+street_coords)
        //console.log("Other_street_coords: "+ other_street_coords.length+" -> "+other_street_coords)
        //console.log("street_id: "+street_id+" other_street_id: "+other_street_id)
    
        let identified_intersections = getIntersections(street_coords, other_street_coords, [street_id, other_street_id]).map(
          identified_intersection => [L.latLng(reversedCoordinates(identified_intersection[0])), identified_intersection[1]]
        )
  
        if (identified_intersections.length > 0) {
                  street.intersections[other_street_id] = identified_intersections;
                  other_street.intersections = typeof(other_street.intersections) === "undefined" ? {} : other_street.intersections;
                  other_street.intersections[street_id] = identified_intersections;
        }
      
        
       
  
        //console.log(street)
        //console.log(other_street)
        
      }
    })
  }

  function getIntersections(arr_a, arr_b, ids = []) {
    //console.log("Total street ids: "+ids.length)
      let intersections = [];
  
      for (let i = 0; i < arr_a.length; i++) {
          let el_a = arr_a[i];
  
          for (let j = 0; j < arr_b.length; j++) {
              let el_b = arr_b[j];
        
        // for connecting same roads!!
              if (isPointCoordinates(el_a) && isPointCoordinates(el_b)) {
                  if (el_a[0] === el_b[0] && el_a[1] === el_b[1]) {
            //console.log("Same point. Printing points: "+ el_a)
                      let new_intersection;
  
                      if (ids.length === 2) {
                          let identified_intersections = {};
                          identified_intersections[ids[0]] = i
                          identified_intersections[ids[1]] = j
              new_intersection = [el_a, identified_intersections];
                      }
                      else {
                          new_intersection = el_a;
                      }
                  
                      intersections.push(new_intersection);
                  }
              }
              else {
                  throw new Error("Every element of each array must be a coordinate pair array.");
              }
          }
      }
  
      return intersections;
  }

 

function isPointCoordinates(array) {
	if (array.length !== 2 || 
		typeof(array[0]) !== "number" ||
		typeof(array[1]) !== "number") {
		return false;
	}

	return true;
}



function reversedCoordinates(coordinates) {
	let reversed = coordinates.slice();
	if (typeof coordinates[0] != "number") {
		for (let inner_coordinates of coordinates) {
			reversed.splice(reversed.indexOf(inner_coordinates), 1, reversedCoordinates(inner_coordinates));
		}
	}
	else {
		reversed = [coordinates[1], coordinates[0]];
	}

	return reversed;
}





//  // testing
//  for (let k = 0; k < street_features.length; k++){
//     //console.log(street_features[k].geometry.coordinates)
//     for (let f = 0; f < street_features[k].geometry.coordinates.length; f++){
      
//       //if(street_features[k].id === "way/21581831" || street_features[k].id === "way/21573270"){
//         let latLng = {
//           lat: street_features[k].geometry.coordinates[f][1],
//           lng: street_features[k].geometry.coordinates[f][0]
//         }

//         //L.marker(latLng, { title: "test",riseOnHover:true }).addTo(layerRef.current);
//       //}
//     }
//   }
