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


const TaskSetting = (props) => {
    const classes = useStyles();
    return (
        <Card>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
              Task Parameters
              </Typography>
              <Grid container direction="column" spacing={2} align>
                <Grid item container direction="row" xs={12}>
                  <Grid item xs={6}>Value of Task</Grid>
                  <Grid item xs={6}>
                  <select>
                    <option value="volvo">Random</option>
                    <option value="saab">Distance</option>
                  </select>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Value per 1km</Grid>
                  <Grid item xs={6}>
                    <input type="text"/>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Peak hour rate</Grid>
                  <Grid item xs={6}>
                    <input type="text"/>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Reputation given type</Grid>
                  <Grid item xs={6}>
                  <select>
                    <option value="volvo">Random (0 - 5)</option>
                    <option value="saab">Fixed</option>
                  </select>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>Reputation value (0-5)</Grid>
                  <Grid item xs={6}>
                    <input type="text"/>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Typography className={classes.title2} color="textSecondary" gutterBottom>
              Driver Paramaters
              </Typography> */}
            </CardContent>
        </Card>
    )
}

export default TaskSetting;