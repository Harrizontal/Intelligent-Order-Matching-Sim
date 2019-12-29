import L from "leaflet";
import * as turf from '@turf/turf'
import * as ngraph from 'ngraph.graph'
import {pointToCoordinateArray,encodeLatLng} from "./commonulti"

export const streetsToGraph = streets => {
  let createGraph = ngraph
  let graph = createGraph(),
    streetToGraphBound = streetToGraph.bind(this, graph);

  //For each street, get an array of indices for the start, intersections, and end coordinates, in order from
  //start to end. Then, add the coordinates at each index as a node, and an edge between each adjacent node in the array,
  //associating the distance between the nodes (between their coordinates) with each edge.
  streets.eachLayer(streetToGraphBound);
  return graph
};

export const streetToGraph = (graph, street) => {
  //console.log("Converting street to graph")
  //console.log(street.getLatLngs())
  	let street_id = street._leaflet_id, intersection_indices = [], street_points = street.getLatLngs();
  
	for (let cross_street in street.intersections) {
			let intersections = street.intersections[cross_street];
			//console.log(intersections)
			for (let intersection of intersections) {
		let intersection_index = intersection[1][street_id];
		//console.log(intersection_index)
		
			// 	//Ignore duplicate intersection points (caused by 3-way intersections).
				if (!intersection_indices.some(other_intersection_index => other_intersection_index === intersection_index)) {
					intersection_indices.push(intersection_index);
				}
			}
	}

  	//Sort the intersection_indices so that they are in order from the start of the street's coordinate array to the end;
	//this is why we're not getting the raw coordinates, but their indices first, so they can be sorted.
	intersection_indices = intersection_indices.sort(function(a, b) {
		return a - b;
  	});
  
  	//Check if beginning and end points of the street are in the intersection_incides; if not, add them.
	if (!intersection_indices.some(intersection_index => intersection_index === 0)) {
		intersection_indices.unshift(0);
	}

	if (!intersection_indices.some(intersection_index => intersection_index === street_points.length - 1)) {
		intersection_indices.push(street_points.length - 1);
	}
	  
	  // uncomment for reducing nodes
  	for (let i = 0; i <= intersection_indices.length - 2; i++) {
		let node_a = street_points[intersection_indices[i]],
		node_b = street_points[intersection_indices[i + 1]],
		a_string = encodeLatLng(node_a),
		b_string = encodeLatLng(node_b),
		start_coords = pointToCoordinateArray(node_a),
		end_coords = pointToCoordinateArray(node_b),
		segment = turf.lineSlice(start_coords, end_coords, street.toGeoJSON()),
		distance = turf.length(segment);
		graph.addLink(a_string, b_string, {
			distance: distance,
			place: { type: "street",
				id: street_id } 
		});
	}
  
//   var test = []
//   for (let i = 0; i < street.getLatLngs().length; i++){
// 	test.push(i)
//   }
  //console.log(test)

  // is odd
//   if (!(test.length % 2 == 0)){
// 	//console.log("odd")
// 	for (let i = 0; i < test.length- 1 ;i++){
// 		let node_a = street_points[test[i]],
// 			node_b = street_points[test[i + 1]],
// 			a_string = encodeLatLng(node_a),
// 			b_string = encodeLatLng(node_b),
// 			start_coords = pointToCoordinateArray(node_a),
// 			end_coords = pointToCoordinateArray(node_b),
// 			segment = turf.lineSlice(start_coords, end_coords, street.toGeoJSON()),
// 			distance = turf.length(segment);
// 			graph.addLink(a_string, b_string, {
// 				distance: distance,
// 				place: { type: "street",
// 					id: street_id } 
// 			});
// 	  }
	
//   }else{
// 	//console.log("even")
// 	for (let i = 0; i <= test.length - 2; i++) {
// 		let node_a = street_points[test[i]],
// 		node_b = street_points[test[i + 1]],
// 		a_string = encodeLatLng(node_a),
// 		b_string = encodeLatLng(node_b),
// 		start_coords = pointToCoordinateArray(node_a),
// 		end_coords = pointToCoordinateArray(node_b),
// 		segment = turf.lineSlice(start_coords, end_coords, street.toGeoJSON()),
// 		distance = turf.length(segment);
// 		graph.addLink(a_string, b_string, {
// 			distance: distance,
// 			place: { type: "street",
// 				id: street_id } 
//     });
// 	}
//   }
};







