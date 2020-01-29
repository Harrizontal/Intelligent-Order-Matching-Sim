import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import { Component } from "react";
import c3 from "c3"
import "c3/c3.css";


export default class LineChart extends Component {
    componentDidMount(){
        this._updateChart();
    }

    componentDidUpdate(){
        this._updateChart();
    }

    _updateChart(){
        const chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: this.props.columns,
                type: this.props.chartType
            }
        });
    }

    render(){
        return <div id="chart">Hi</div>
    }
}