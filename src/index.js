import React from "react";
import "./index.scss";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";  
import store from "./Redux/Store";
import App from "./App";
import './output.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>  
    <App />  
  </Provider>
);
