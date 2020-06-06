import React, { useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

const DriverParameters = forwardRef((props,ref) => {
    const [travelMode,setTravelMode] = useState("node")
    const [speed,setSpeed] = useState(120)
    const [interval, setInterval] = useState(50)

    useImperativeHandle(ref, () => ({
      getDriverParameters(){
        let params = {
          travelling_mode: travelMode, 
          speed_km_per_hour: parseFloat(speed),
          travel_interval: parseInt(interval)
        }
        return params
      }
    }))

    
    const changeTravelMode = (e) => {
      setTravelMode(e.target.value)
      switch(e.target.value){
        case "node":
          setSpeed(120)
          break
        case "distance":
          setInterval(50)
          break
      }
    }

    return (
      <Card style={{margin:"1% 1% 1% 1%"}}>
        <Card.Header>Driver</Card.Header>
        <Card.Body>
          <Card.Text>
              <Form.Group controlId="formTravellingMode">
                <Form.Label>Travelling mode</Form.Label>
                <Form.Control as="select" size="sm" value={travelMode} onChange={changeTravelMode}>
                  <option value="node">Travel by node</option>
                  <option value="distance">Travel by distance</option>
                </Form.Control>
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col} controlId="formTravelInterval">
                  <Form.Label>Travel by Node Interval (in ms)</Form.Label>
                  <Form.Control size="sm" type="text" placeholder="5" value={interval} onChange={e => setInterval(e.target.value)} disabled={travelMode == "distance"}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formSpeedKmPerHour">
                  <Form.Label>Speed (km/hour)</Form.Label>
                  <Form.Control size="sm" type="text" placeholder="5" value={speed} onChange={e => setSpeed(e.target.value)} disabled={travelMode == "node"}/>
                </Form.Group>
              </Form.Row>
          </Card.Text>
        </Card.Body>
      </Card>
    )
})

export default DriverParameters;