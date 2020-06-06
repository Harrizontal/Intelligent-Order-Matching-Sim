# A map visualization tool for Multi-Agent Ride Sharing System Simulation
An user interface equipped with a map for a testbed on studying virus (e.g COVID-19) spreading in ride-sharing systems

## Preview
![Preview](https://i.gyazo.com/5d4299f375695df72d922129ed051bf6.gif)
You can access the gif over [here](https://gyazo.com/5d4299f375695df72d922129ed051bf6)

## Background
The simulator is equipped with a novel order dispatch algorithm in large-scale on-demand ride-hailing platforms
that take account of the dynamic characteristics associated with workers. Although most traditional order dispatch approaches generally focus on providing a better user experience for passengers and maximizing revenue by optimizing resource utilization, the proposed
algorithm is designed to take into an account of the collective productivity of all workers and maximizing it opportunistically in response to stochastic changes in situational factors. This is also accompanied by a Multi-Agent Simulation to simulate the complex action and interactions of the drivers and passengers, and to analyze the effects of change in factors. After the implementation of the algorithm and simulation, we evaluated the effects in earnings, reputation and fatigue. In the most recent outbreak of the disease on COVID-19, the simulation also has a few mechanisms in showing how it spread among the drivers and passengers through the use of the proposed algorithm. 

## Prerequisites (External)

Please download the [Golang Simulation](https://github.com/Harrizontal/dispatchserver) and run the dispatcher simulator server first.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Steps to run the simulation
![Steps](https://i.gyazo.com/aa3b80bcc52545a3e58c6f4ee631d1bf.gif)
You can access the gif over [here](https://gyazo.com/aa3b80bcc52545a3e58c6f4ee631d1bf)
Please ensure you have started running the simulator (Golang).

1. Click "Connect" button to connect the simulator (Golang) via Websocket
2. Adjust the parameters and submit the parameters to the simulator
3. Draw a boundary on the map
4. Enter the number of drivers to spawn (< 500)
5. Click "Spawn" button
6. Click "Retrieve Orders" button for the simulator to load the ride (orders) data
7. Click "Start" button


## Drivers and virus data 
![Data](https://i.gyazo.com/8d9d8b1ee46449137e5b7aff320d201e.gif)
You can access the gif over [here](https://gyazo.com/8d9d8b1ee46449137e5b7aff320d201e)
The map visulization tool is able to generate data regarding to the drivers (reputation, fatigue, etc) and virus after the simulation has **ended** . It is stored under driver and virus folder under Assets folder (in the simulator)

