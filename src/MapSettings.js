import React, {useState, useImperativeHandle, forwardRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const MapSettings = forwardRef((props,ref) => {
    const dispatch = useDispatch()

    const changeType = (e) => {
        console.log(e.target.value)
        dispatch({
            type: "SET_TYPE",
            payload: parseInt(e.target.value)
        })
    }

 

    return (
        <Card style={{margin:"1% 1% 1% 1%"}}>
        <Card.Header>Map Display Settings</Card.Header>
        <Card.Body>
          <Card.Text>
            <Form.Group as={Row}>
                    <Col sm={3}>
                        <Form.Check type="radio" label="Driver's Status" value="1" name="formHorizontalRadios" defaultChecked onChange={e => changeType(e)}/>  
                    </Col>
                    <Col sm={3}>
                        <Form.Check type="radio" label="Virus" value="2" name="formHorizontalRadios" onChange={e => changeType(e)}/>
                    </Col>
                </Form.Group>
          </Card.Text>
        </Card.Body>
      </Card>
    )
})

export default MapSettings;