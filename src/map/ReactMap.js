/* global mapboxgl */

import React, { Component } from "react";

import MAP_STYLE from "./map-style-basic-v8.json";
import { arrayExpression, throwStatement } from "@babel/types";
import { relative } from "path";

class ReactMap extends Component {
  state = {
    listOfPassengerMarkers: []
  };

  constructor(props) {
    super(props);
    this.route = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [104.063185, 30.66999],
              [104.063121, 30.671389],
              [104.063175, 30.671557],
              [104.064085, 30.672854],
              [104.064415, 30.672689],
              [104.06544, 30.672154],
              [104.066001, 30.672036],
              [104.066459, 30.672029],
              [104.067463, 30.671774],
              [104.068221, 30.671739],
              [104.068205, 30.671288],
              [104.068167, 30.670539],
              [104.068111, 30.669753],
              [104.068101, 30.669589],
              [104.068085, 30.669469],
              [104.068085, 30.668947],
              [104.068085, 30.667667],
              [104.068107, 30.666137],
              [104.068112, 30.665801],
              [104.068176, 30.664524],
              [104.068242, 30.663481],
              [104.068296, 30.662639],
              [104.068299, 30.662468],
              [104.068396, 30.660972],
              [104.068406, 30.660801],
              [104.068598, 30.660801],
              [104.069015, 30.660847],
              [104.069457, 30.660811],
              [104.069579, 30.660805],
              [104.070477, 30.660817],
              [104.07126, 30.660847],
              [104.071929, 30.660904],
              [104.072818, 30.660914],
              [104.074145, 30.660943],
              [104.074355, 30.660945],
              [104.074528, 30.660939],
              [104.074693, 30.660922],
              [104.074848, 30.660896],
              [104.074999, 30.660857],
              [104.075248, 30.660768],
              [104.076087, 30.660369],
              [104.076776, 30.660055],
              [104.077169, 30.659886],
              [104.077973, 30.659516],
              [104.078688, 30.659187],
              [104.078996, 30.65906],
              [104.07905, 30.659146],
              [104.079915, 30.660525],
              [104.080261, 30.661074],
              [104.080336, 30.661382],
              [104.080387, 30.661463]
            ]
          }
        }
      ]
    };
    this.point = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            icon: "monument"
          },
          geometry: {
            type: "Point",
            coordinates: [104.063185, 30.66999]
          }
        }
      ]
    };
    this.counter = 0;
    this.steps = this.route.features[0].geometry.coordinates.length;
  }

  generateMarkers = () => {
    const map = this.map;
    var array = [];

    var geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [104.06349, 30.67]
          },
          properties: {
            title: "Passenger 1",
            pickup: [104.06349, 30.67],
            dropoff: [104.08076, 30.66129],
            description: "Business trip"
          }
        }
      ]
    };

    var popup;
    geojson.features.forEach(function(marker) {
      var el = document.createElement("div");
      el.className = "thunder-marker";
      el.style.width = "30px";
      el.style.height = "30px";

      popup = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });

    array.push(popup);
    this.setState({ listOfPassengerMarkers: array });
  };

  componentDidMount() {
    // set map properties
    const { token, longitude, latitude, zoom, minZoom, styleID } = this.props;
    const mapConfig = {
      container: "map",
      style: MAP_STYLE,
      center: [longitude, latitude],
      zoom: zoom
    };
    if (this.props.pitch) mapConfig["pitch"] = this.props.pitch;
    if (this.props.bearing) mapConfig["bearing"] = this.props.bearing;

    mapboxgl.accessToken = token;
    this.map = new mapboxgl.Map(mapConfig);
    this.generateMarkers();

    this.map.on("load", () => {
      console.log("Hello");

      // intiate route
      this.map.addSource("route", {
        type: "geojson",
        data: this.route
      });

      // add layer to route
      this.map.addLayer({
        id: "route",
        source: "route",
        type: "line",
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-width": 5,
          "line-color": "#007cbf"
        }
      });

      // initiate point
      this.map.addSource("point", {
        type: "geojson",
        data: this.point
      });

      // add layer to point
      this.map.addLayer({
        id: "point",
        source: "point",
        type: "symbol",
        layout: {
          "icon-image": "{icon}-15"
        }
      });

      //this.animatePath();
    });
  }

  animatePath = async () => {
    console.log("counter: " + this.counter);
    this.point.features[0].geometry.coordinates = this.route.features[0].geometry.coordinates[0];

    //console.log(this.route.features[0].geometry.coordinates.length);
    //this.route.features[0].geometry.coordinates.shift();

    this.map.getSource("point").setData(this.point);
    this.map.getSource("route").setData(this.route);

    this.route.features[0].geometry.coordinates.shift();

    if (this.counter < this.steps) {
      await this.delayPath(500);
      requestAnimationFrame(this.animatePath);
    }

    this.counter = this.counter + 1;
  };

  delayPath = async delayInMs => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInMs);
    });
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{ width: "80%", height: "100%" }} id="map" />
        <div style={{ width: "20%" }}>
          <a href="#" onClick={this.animatePath}>
            Execute Tasks
          </a>
        </div>
      </div>
    );
  }
}

export default ReactMap;
