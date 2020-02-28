import React, { useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

const TaskSetting = forwardRef((props,ref) => {
    const [taskValueType,setTaskValueType] = useState("distance")
    const [taskValue,setTaskValue] = useState(3)
    const [peakValue, setPeakValue] = useState(1.5)
    const [reputationGivenType, setReputationGivenType] = useState("fixed")
    const [reputationValue, setReputationValue] = useState(5)

    useImperativeHandle(ref, () => ({
      getTaskParameters(){
        let repValue;
        if (reputationGivenType == "random"){
          repValue = 0
        }else{
          repValue = reputationValue
        }
        let params = {
          task_value_type: taskValueType, 
          value_per_km: parseFloat(taskValue),
          peak_hour_rate: parseFloat(peakValue),
          reputation_given_type: reputationGivenType,
          reputation_value: parseFloat(repValue)
        }
        return params
      }
    }))
    const changeTaskValueType = (e) => {
      setTaskValueType(e.target.value)
      console.log(taskValue)
    }
    
    const changeReputationGivenType = (e) => {
      setReputationGivenType(e.target.value)
      switch(e.target.value){
        case "random":
          setReputationValue("nil")
          break
        case "fixed":
          setReputationValue(5)
          break
      }
    }

    return (
      <Card style={{margin:"1% 1% 1% 1%"}}>
        <Card.Header>Task</Card.Header>
        <Card.Body>
          <Card.Text>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Type of Value for Task</Form.Label>
                <Form.Control as="select" size="sm" value={taskValueType} onChange={changeTaskValueType}>
                  <option value="random">Random</option>
                  <option value="distance">Distance between start and end</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formPerKm">
                <Form.Label>Value per 1km (Multiplier)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={taskValue} onChange={e => setTaskValue(e.target.value)}/>
              </Form.Group>

              <Form.Group controlId="formPeak">
                <Form.Label>Peak hour rate (Multipler)</Form.Label>
                <Form.Control size="sm" type="text" placeholder="5" value={peakValue} onChange={e => setPeakValue(e.target.value)}/>
              </Form.Group>
              
              <Form.Row>
                <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                  <Form.Label>Type of Reputation given by Task</Form.Label>
                  <Form.Control as="select" size="sm" value={reputationGivenType} onChange={changeReputationGivenType}>
                    <option value="random">Random (0 - 5)</option>
                    <option value="fixed">Fixed</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="formPeak">
                  <Form.Label>Reputation value (0-5)</Form.Label>
                  <Form.Control size="sm" type="text" placeholder="5" value={reputationValue} disabled={reputationGivenType == "random"}/>
                </Form.Group>
              </Form.Row>
          </Card.Text>
        </Card.Body>
      </Card>
    )
})

export default TaskSetting;