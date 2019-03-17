import React, { PureComponent } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends PureComponent {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }

  componentDidMount () {
    // window.addEventListener('beforeinstallprompt', function (e) {
    //   // e.preventDefault()
    //   // const deferredEvent = e
    //   // if (window.confirm('Do you want a PWA?')) {
    //   //   deferredEvent.prompt().catch(console.log)
    //   // } else {
    //   //   console.log('User does not want PWA')
    //   // }
    // })
  }
}

export default App
