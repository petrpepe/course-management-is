import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import './index.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { getLocale } from "./utils"
import axios from 'axios';

const container = document.getElementById('root');
const root = createRoot(container);
const token = localStorage.getItem("user").token

axios.defaults.baseURL = 'http://localhost:5000';
if(token) axios.defaults.headers.common['Authorization'] = token;

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
                <App />
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
