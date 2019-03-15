import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

if ('serviceWorker' in navigator) {
  console.log('CLIENT: service worker registration in progress.')
  navigator.serviceWorker.register('serviceworker.js').then(
    function() {
      console.log('CLIENT: service worker registration complete.')
    },
    function() {
      console.log('CLIENT: service worker registration failure.')
    }
  )
} else {
  console.log('CLIENT: service worker is not supported.')
}
