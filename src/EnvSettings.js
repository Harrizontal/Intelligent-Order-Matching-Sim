import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

  const createEnvironment = () => {
    var polygon = [
      [103.83736132735794, 1.2797308552192277],
      [103.8374742553188, 1.2710751898569868],
      [103.84191608842156, 1.270999923074129],
      [103.84214194434094, 1.2798437550102904],
      [103.83736132735794, 1.2797308552192277]
    ]
    var command = [1,1,polygon]
    props.ws.current.send(JSON.stringify(command))
    
  }

  const createEnvironment2 = () => {
    var polygon = [
      [103.84234159818976, 1.279866261067454],
      [103.84211574227038, 1.270871895638848],
      [103.84663286067882, 1.27072136205895],
      [103.84685871659826, 1.2799038943300474],
      [103.84234159818976, 1.279866261067454]
    ]
    var command = [1,2,polygon]
    props.ws.current.send(JSON.stringify(command))
  }
  
    const classes = useStyles();
    return(
        <Card>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                Environment
                </Typography>
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
                <Button onClick={createEnvironment} size="small">Create 1</Button>
                <Button onClick={createEnvironment2} size="small">Create 2</Button>
            </CardActions>
        </Card>
    )
}

export default EnvSettings;