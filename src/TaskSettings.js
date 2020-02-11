import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    title: {
      fontSize: 14,
      marginBottom: 15,
    },
    title2: {
      fontSize: 14,
      marginTop: 15,
      marginBottom: 15,
    },
    pos: {
      marginBottom: 12,
    },
  });


const TaskSetting = forwardRef((props,ref) => {
    const classes = useStyles();
    const [taskValueType,setTaskValueType] = useState("distance")
    const [taskValue,setTaskValue] = useState(3)
    const [peakValue, setPeakValue] = useState(1.5)
    const [reputationGivenType, setReputationGivenType] = useState("random")
    const [reputationValue, setReputationValue] = useState("nil")

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
        <Card>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
              Task Parameters
              </Typography>
              <Grid container direction="column" spacing={2} align>
                <Grid item container direction="row" xs={12}>
                  <Grid item xs={6}>Task Value Type</Grid>
                  <Grid item xs={6}>
                  <select value={taskValueType} onChange={changeTaskValueType}>
                    <option value="random">Random</option>
                    <option value="distance">Waypoint distance</option>
                  </select>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Value per 1km (Multiplier)</Grid>
                  <Grid item xs={6}>
                    <input type="text" value={taskValue} onChange={e => setTaskValue(e.target.value)}/>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Peak hour rate (Multipler)</Grid>
                  <Grid item xs={6}>
                    <input type="text" value={peakValue} onChange={e => setPeakValue(e.target.value)}/>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Reputation given type</Grid>
                  <Grid item xs={6}>
                  <select value={reputationGivenType} onChange={changeReputationGivenType}>
                    <option value="random">Random (0 - 5)</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Reputation value (0-5)</Grid>
                  <Grid item xs={6}>
                    <input type="text" value={reputationValue} disabled={reputationGivenType == "random"}/>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Typography className={classes.title2} color="textSecondary" gutterBottom>
              Driver Paramaters
              </Typography> */}
            </CardContent>
        </Card>
    )
})

export default TaskSetting;