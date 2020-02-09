import React, { Component } from 'react';
import PhotoBrowser from './PhotoBrowser';
class App extends Component {
  render() {
    return (
      <PhotoBrowser {...this.props} />
    );
  }
}

export default App;
