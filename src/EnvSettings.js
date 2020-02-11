import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useSelector,useDispatch } from "react-redux";

const useStyles = makeStyles({
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

const EnvSettings = (props) => {
  const noOfDriver = useRef(0)
  const [noOfDrivers, setNoOfDrivers] = useState(0);
  const mapDraw = useSelector(state => state.mapDraw)
  const dispatch = useDispatch()

  // const createEnvironment = () => {
  //   var polygon = [
  //     [103.83736132735794, 1.2797308552192277],
  //     [103.8374742553188, 1.2710751898569868],
  //     [103.84191608842156, 1.270999923074129],
  //     [103.84214194434094, 1.2798437550102904],
  //     [103.83736132735794, 1.2797308552192277]
  //   ]
  //   var command = [1,3,polygon]
  //   props.ws.current.send(JSON.stringify(command))
    
  // }

  const createEnvironment = () => {
    console.log(mapDraw)
    if (mapDraw.polygon_coordinates != null){
      // console.log("Environment Created")
      // console.log(mapDraw.polygon_coordinates)
      var command = [1,parseInt(noOfDrivers),mapDraw.polygon_coordinates]
      props.ws.current.send(JSON.stringify(command))
      // dispatch({
      //   type: "DELETE_POLYGON"
      // })
      // dispatch({
      //   type: "DECREMENT"
      // })
    }else{
      alert("No polygon selected")
    }

    

    // var polygon = [
    //   [103.84234159818976, 1.279866261067454],
    //   [103.84211574227038, 1.270871895638848],
    //   [103.84663286067882, 1.27072136205895],
    //   [103.84685871659826, 1.2799038943300474],
    //   [103.84234159818976, 1.279866261067454]
    // ]
    // var command = [1,2,polygon]
    // props.ws.current.send(JSON.stringify(command))
  }

  const handleTextFieldChange = (e) => {
    noOfDriver.current = e.target.value
    console.log(noOfDriver.current)
  }
  
  const classes = useStyles();
  return(
      <Card>
          <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
              Environment
              </Typography>
              <div>{mapDraw.polygon_coordinates}</div>
              {/* <Typography variant="h5" component="h2">
              be{bull}nev{bull}o{bull}lent
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              adjective
              </Typography>
              <Typography variant="body2" component="p">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
              </Typography> */}
          </CardContent>
          <CardActions>
              No of Drivers:
              <input type="text" name="lname" value={noOfDrivers} onChange={e => setNoOfDrivers(e.target.value)} />
              {/* <TextField id="outlined-basic" variant="outlined" label="No Of Drivers" size="small" defaultValue={noOfDriver.current} onChange={handleTextFieldChange} /> */}
              <Button onClick={createEnvironment} size="small">Spawn</Button>
          </CardActions>
      </Card>
  )
}

export default EnvSettings;