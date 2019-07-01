import React, { Component } from 'react';
import './App.css';
import Weather from './Weather/Weather.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Temperature logger</h1>
        <Weather />
      </div>
    );
  }
}

export default App;