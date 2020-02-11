import React, {useState, useImperativeHandle, forwardRef } from "react";
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
    pos: {
      marginBottom: 12,
    },
  });


const DispatcherParameters = forwardRef((props,ref) => {
    const [dispatchInt, setDispatchInt] = useState(5000)
    const [simReputation, setSimReputation] = useState(1.5)

    useImperativeHandle(ref, () => ({
      getDispatchParameters(){
        let params = {
          dispatcher_interval: parseFloat(dispatchInt),
          similiar_reputation: parseFloat(simReputation)
        }
        return params
      }
    }))

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
                        <input type="text" value={dispatchInt} onChange={e => setDispatchInt(e.target.value)}/>
                    </Grid>
                  </Grid>
                  <Grid container direction="row">
                    <Grid item xs={6}>Similar Reputation (+/-)</Grid>
                    <Grid item xs={6}>
                      <input type="text" value={simReputation} onChange={e => setSimReputation(e.target.value)}/>
                    </Grid>
                  </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
})

export default DispatcherParameters;