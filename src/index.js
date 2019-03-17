import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

var config = {
  apiKey: 'AIzaSyDTvaZCIfSGGWCrDa0_9AxqZNp3DmrypmY',
  authDomain: 'first-pwa-cf9c8.firebaseapp.com',
  databaseURL: 'https://first-pwa-cf9c8.firebaseio.com',
  projectId: 'first-pwa-cf9c8',
  storageBucket: 'first-pwa-cf9c8.appspot.com',
  messagingSenderId: '206311904275'
}

const applicationServerPublicKey =
  'BKOcXNP2asHx5eHlaCQvWOXe-WwKu4imHQVqnM' +
  'zBg0Ch1mW6AgeEtEiCYjGPVlnxouP1semi3yHl2EMa4pEhNqE'

const { firebase } = window

firebase.initializeApp(config)

const messaging = firebase.messaging()

messaging.usePublicVapidKey(applicationServerPublicKey)

messaging
  .requestPermission()
  .then(function () {
    console.log('Notification permission granted.')
  })
  .catch(function (err) {
    console.log('Unable to get permission to notify.', err)
  })

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

if ('serviceWorker' in navigator) {
  console.log('CLIENT: service worker registration in progress.')
  navigator.serviceWorker
    .register('serviceworker.js')
    .then(function (swReg) {
      console.log('CLIENT: service worker registration complete.')
      return swReg
    })
    .then(function (reg) {
      const applicationServerKey = urlB64ToUint8Array(
        applicationServerPublicKey
      )

      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })
    })
    .then(reg =>
      reg.pushManager.getSubscription().then(isSubscribed => {
        if (isSubscribed) {
          console.log('User IS subscribed.')
        } else {
          console.log('User is NOT subscribed.')
        }
      })
    )
    .catch(function () {
      console.log('CLIENT: service worker registration failure.')
    })
} else {
  console.log('CLIENT: service worker is not supported.')
}
