import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.scss"
import { AuthContextProvider } from './context/AuthContext.jsx'
import axios from 'axios';
import { SocketContextProvider } from './context/SocketContext.jsx'

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
