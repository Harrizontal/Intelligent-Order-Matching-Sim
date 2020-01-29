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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    title: {
      fontSize: 14,
      marginBottom: 15,
    },
    pos: {
      marginBottom: 12,
    },
  });


const DispatcherParameters = (props) => {
    const classes = useStyles();
    return (
        <Card>
            <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Dispatcher Parameters
              </Typography>
                <Grid container direction="column" spacing={2} align>
                  <Grid container direction="row" xs={12}>
                    <Grid item xs={6}>Dispatch Interval (in ms)</Grid>
                    <Grid item xs={6}>
                        <input type="text"/>
                    </Grid>
                  </Grid>
                  <Grid container direction="row">
                    <Grid item xs={6}>Similar Reputation (+/-)</Grid>
                    <Grid item xs={6}>
                      <input type="text"/>
                    </Grid>
                  </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default DispatcherParameters;