import React, {useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

// 'Dispatcher Parameters' section under 'General' tab
const DispatcherParameters = forwardRef((props,ref) => {
    const [dispatchInt, setDispatchInt] = useState(5000)
    const [simReputation, setSimReputation] = useState(5)

    useImperativeHandle(ref, () => ({
      getDispatchParameters(){
        let params = {
          dispatcher_interval: parseFloat(dispatchInt),
          similar_reputation: parseFloat(simReputation)
        }
        return params
      }
    }))

    return (
      <Card style={{margin:"1% 1% 1% 1%"}}>
        <Card.Header>Dispatcher Parameters</Card.Header>
        <Card.Body>
          <Card.Title>Adjust distribution speed of order dispatcher</Card.Title>
          <Card.Text>
            <Form.Group controlId="formDispatchInterval">
              <Form.Label>Dispatch Interval (in ms)</Form.Label>
              <Form.Control size="sm" type="text" placeholder="5" value={dispatchInt} onChange={e => setDispatchInt(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formSimilarReputation">
              <Form.Label>Similar Reputation (+/-)</Form.Label>
              <Form.Control size="sm" type="text" placeholder="5" value={simReputation} onChange={e => setSimReputation(e.target.value)}/>
            </Form.Group>
          </Card.Text>
        </Card.Body>
      </Card>
    )
})

export default DispatcherParameters;