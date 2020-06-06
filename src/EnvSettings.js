import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

// 'Boundary' section under 'Control' tab
const EnvSettings = (props) => {
  const [noOfDrivers, setNoOfDrivers] = useState(0);
  const mapDraw = useSelector(state => state.mapDraw)
  const dispatch = useDispatch()


  const createEnvironment = () => {
    console.log(mapDraw)
    if (mapDraw.polygon_coordinates != null){
      var command = [1,parseInt(noOfDrivers),mapDraw.polygon_coordinates]
      if (props.ws.current != null){
        props.ws.current.send(JSON.stringify(command))
        dispatch({
          type: "DELETE_POLYGON"
        })
      }else{
        alert("Please connect to Golang backend first.")
      }
    }else{
      alert("No polygon selected")
    }
  }
  
  return(
    <Card style={{margin:"1%"}}>
        <Card.Header>Boundary</Card.Header>
        <Card.Body>
          <Card.Text>
            {mapDraw.polygon_coordinates != null ? <Alert variant='success'>Polygon drawn</Alert> : ""}
            
            <Form.Group controlId="formGridEmail">
              <Form.Label>Enter a number of drivers to spawn</Form.Label>
              <Form.Control type="text" placeholder="e.g 400" onChange={e => setNoOfDrivers(e.target.value)}  />
            </Form.Group>
            <Button onClick={createEnvironment} size="small">Spawn</Button>
          </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default EnvSettings;