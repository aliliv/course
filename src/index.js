import React from 'react';
import ReactDOM from 'react-dom';
import "semantic-ui-css/semantic.min.css"
import './index.css';
import App from '../src/components/root/App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import configureStore from  "./redux/reducers/configureStore"
import {Provider} from "react-redux"
import {BrowserRouter} from "react-router-dom"
import 'alertifyjs/build/css/alertify.min.css'

const store=configureStore();

ReactDOM.render(<BrowserRouter><Provider store={store}><App /></Provider></BrowserRouter>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

