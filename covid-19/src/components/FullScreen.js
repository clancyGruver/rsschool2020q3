import React from 'react';
import ToFullScreen from '../assets/images/tofullscreen.svg';
import Minimize from '../assets/images/minimize.svg';
import Style from '../styles/FullScreen.module.css';

export default class FullScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isFullScreen: true,
      rowElement: null,
    }
  }

  clickHandler(e) {
    const isFullScreen = !this.state.isFullScreen;
    this.setState({ isFullScreen });
    const rowElement = e.target.closest('.row');
    this.setState({ rowElement }, this.changeClass());
  }

  changeClass(){
    if(this.state.rowElement) {
      this.state.rowElement.classList.toggle('row');
      this.state.rowElement.classList.toggle('full-screen');
    }
  }

  render() {
    const el = this.state.isFullScreen ?
      <img src={ToFullScreen} alt="to full screen" className={Style.icon} onClick={(e)=>this.clickHandler(e)} /> :
      <img src={Minimize} alt="minimize screen" className={Style.icon} onClick={(e)=>this.clickHandler(e)} />
    return el;
  }
}