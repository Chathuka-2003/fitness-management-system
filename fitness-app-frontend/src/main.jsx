import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from 'react-oidc-context'
import App from './App'
import authConfig from './authConfig'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider {...authConfig}>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
)