import './assets/tailwind.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


console.log('React está montando el componente...');
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
