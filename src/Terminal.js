import React, { forwardRef } from "react";
import Card from 'react-bootstrap/Card'

// 'Terminal' section under 'Control' tab
// Just to display messages from the Golang simulation
const Terminal = forwardRef((props,ref) => {

    const lines = props.data.map((line) =>
        <p style={{margin:0,padding:0}}>{line}</p>
    );

    return (
        <Card style={{margin:"1% 1% 1% 1%"}}>
            <Card.Header>Terminal</Card.Header>
            <Card.Body>
            <Card.Text>
                <div style={{overflowY: "scroll", maxHeight:"100px" }} className="terminal">
                    {lines}
                </div>
            </Card.Text>
            </Card.Body>
      </Card>
    )
})
export default Terminal;