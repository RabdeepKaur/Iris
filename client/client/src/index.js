import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import{BrowserRouter} from "react-router-dom"
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvder } from './context/SocketProvder';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <SocketProvder>
    <App />
    </SocketProvder>
  
    </BrowserRouter>
   
  </React.StrictMode>
);


reportWebVitals();
