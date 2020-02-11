import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import App from './App'
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux'
import store from './store'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#FF8954',
        contrastText: 'white'
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
      background: {
        default: '#F5F5F8'
      }
    },
  });

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline/>
        <Provider store={store}>
            <App />
        </Provider>
    </ThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
