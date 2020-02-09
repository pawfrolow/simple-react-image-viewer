import React from 'react';
import ReactDOM from 'react-dom';

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class Portal extends React.Component {
    constructor(props) {
      super(props);
      this.el = document.createElement('div');
      this.el.setAttribute('id', `${this.props.className}_${new Date().getTime()}${getRandomArbitrary(111111,999999)}`);
      this.el.setAttribute('class', this.props.className);
    }

    componentDidMount() {
      document.body.appendChild(this.el);
    }
  
    componentWillUnmount() {
      document.body.removeChild(this.el);
    }
  
    render() {
      return ReactDOM.createPortal(
        this.props.children,
        this.el,
      );
    }
  }

Portal.defaultProps = {
  className: ''
}

