import React, { useState,useEffect,useRef } from "react";
import "./App.css";


const io = require('socket.io-client');
const socket = io('ws://localhost:8080/ws');

function App2() {

    return (
        <div>Hello</div>
    )

}

export default App2;