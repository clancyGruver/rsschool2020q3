import React from 'react';
import fullScreen from '../assets/images/full-screen.svg';
import minimize from '../assets/images/minimize.svg';

export default class FullScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isFullScreen: true,
    }
  }

  clickHandler() {
    const isFullScreen = !this.state.isFullScreen;
    this.setState({ isFullScreen });
  }
  
  render() {
    return (
      {}this.state.isFullScreen
      ? <fullScreen onClick={this.clickHandler} />
      : <minimize onClick={this.clickHandler} />
    );
  }
}