import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { PointsProvider } from './context/PointsContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PointsProvider>
        <App />
      </PointsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
