import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
//import reportWebVitals from './reportWebVitals';
import "./index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getLocale } from "./utils";
import axios from "axios";

const container = document.getElementById("root");
const root = createRoot(container);
let hostname = window.location.hostname;
if (hostname.includes("onrender")) hostname = "sis-cr.onrender.com";
axios.defaults.baseURL = window.location.protocol + "//" + hostname + ":5000/";

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={getLocale()}>
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
