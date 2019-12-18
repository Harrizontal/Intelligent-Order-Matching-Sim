

export const pointToCoordinateArray = (point) => {
	let coordinate_array;

	if (typeof(point.lat) === "number" && typeof(point.lng) === "number") {
		coordinate_array = [point.lng, point.lat];
	}
	else if (point.geometry && point.geometry.coordinates && isPointCoordinates(point.geometry.coordinates)) {
		coordinate_array = point.geometry.coordinates;
	}
	else if (isPointCoordinates(point)) {
		coordinate_array = point;
	}
	else {
		throw new Error("Invalid point: point must either be array of 2 coordinates, or an L.latLng.");
	}

	return coordinate_array;
}

export const leafetLatLngToPoint = (latlng) => {
    return [latlng.lng,latlng.lat]
}
/**
 * Convert an array of Points to MultiLine (Turf)
 * @param {*} latlngs 
 */

 // var line1 = turf.multiLineString(convertPointsToMultiLine(street.getLatLngs().map(leafetLatLngToPoint)))
        // var line2 = turf.multiLineString(convertPointsToMultiLine(other_street.getLatLngs().map(leafetLatLngToPoint)))
        // var intersects = turf.lineIntersect(line1, line2);
export const convertPointsToMultiLine = (latlngs) => {
    let multLineString = []
    if(latlngs.length === 1){
        throw("why got 1 only")
    }
    for (let i = 0; i < latlngs.length - 1; i++){
        let lineString = []
        lineString.push(latlngs[i])
        lineString.push(latlngs[i+1])
        multLineString.push(lineString)
    }

    return multLineString
}

export const encodeLatLng = (lat_lng) => {
	return lat_lng.lat.toString() + "," + lat_lng.lng.toString();
}


export const isPointCoordinates = (array) => {
	if (array.length !== 2 || 
		typeof(array[0]) !== "number" ||
		typeof(array[1]) !== "number") {
		return false;
	}

	return true;
}