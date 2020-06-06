import React, {useState, useImperativeHandle, forwardRef } from "react";
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'


// Under 'Virus' tab where the user can tuned the virus parameters
const VirusParameters = forwardRef((props,ref) => {
    const [infectedDrivers, setInfectedDrivers] = useState(10)
    const [infectedTasks, setInfectedTasks] = useState(10)
    const [evolveProb, setEvolveProb] = useState("0.5,1")
    const [spreadProb, setSpreadProb] = useState("4,9,13")
    const [passengerMask, setPassengerMask] = useState(10)
    const [driverMask, setDriverMask] = useState(10)
    const [maskEffect, setMaskEffect] = useState(95)

    useImperativeHandle(ref, () => ({
      getVirusParameters(){
        let params = {
          infected_drivers: parseInt(infectedDrivers),
          infected_tasks: parseInt(infectedTasks),
          evolve_probability: evolveProb.split(",").map(Number),
          spread_probability: spreadProb.split(",").map(Number),
          passenger_mask: parseInt(passengerMask),
          driver_mask: parseInt(driverMask),
          mask_effectiveness: parseFloat(maskEffect)
        }
        return params
      }
    }))

    return (

      <Card style={{margin:"1% 1% 1% 1%"}}>
        <Card.Header>Virus </Card.Header>
        <Card.Body>
          <Card.Text>
            <Form.Row>
              <Form.Group as={Col} controlId="formDriversInfected">
                <Form.Label>% of Drivers infected (0-100)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={infectedDrivers} onChange={e => setInfectedDrivers(e.target.value)}/>
              </Form.Group>
              <Form.Group as={Col} controlId="formTasksInfected">
                <Form.Label>% of Tasks infected (0-100)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={infectedTasks} onChange={e => setInfectedTasks(e.target.value)}/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formDriversMask">
                <Form.Label>% of Drivers with Mask (0-100)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={driverMask} onChange={e => setDriverMask(e.target.value)}/>
              </Form.Group>
              <Form.Group as={Col} controlId="formPassengersMask">
                <Form.Label>% of Passengers with Mask (0-100)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={passengerMask} onChange={e => setPassengerMask(e.target.value)}/>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formMaskEffectiveness">
              <Form.Label>% of Mask Effectiveness (0-100)</Form.Label>
              <Form.Control size="sm" type="text" placeholder="5" value={maskEffect} onChange={e => setMaskEffect(e.target.value)}/>
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formEvolveProb">
                <Form.Label>Evolve Probability (%)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={evolveProb} onChange={e => setEvolveProb(e.target.value)}/>
              </Form.Group>
              <Form.Group as={Col} controlId="formSpreadProb">
                <Form.Label>Spread Probability (%)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={spreadProb} onChange={e => setSpreadProb(e.target.value)}/>
              </Form.Group>
            </Form.Row>
          </Card.Text>
        </Card.Body>
      </Card>

    )
})

export default VirusParameters;