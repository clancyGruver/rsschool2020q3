import React from 'react';
import ToFullScreen from '../assets/images/tofullscreen.svg';
import Minimize from '../assets/images/minimize.svg';
import Style from '../styles/FullScreen.module.css';

export default class FullScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isFullScreen: false,
      rowElement: null,
      className: null,
    }
  }

  clickHandler(e) {
    if(!this.state.rowElement) {
      let rowElement = null;
      let className = null;
      if(e.target.closest('.col-2')){
        rowElement = e.target.closest('.col-2');
        className = 'col-2';
      } else if(e.target.closest('.col-6')) {
        rowElement = e.target.closest('.col-6');
        className = 'col-6';
      } else if(e.target.closest('.row')) {
        rowElement = e.target.closest('.row');
        className = 'row';
      }
      this.setState({
        rowElement,
        className,
       }, this.changeClass());
    } else {
      this.changeClass();
    }
  }

  changeClass(){
    if(this.state.rowElement) {
      this.state.rowElement.classList.toggle(this.state.className);
      if(this.state.className.startsWith('col')){
        this.state.rowElement.classList.toggle('position-relative');
      }
      this.state.rowElement.classList.toggle('full-screen');
      const isFullScreen = !this.state.isFullScreen;
      this.setState({ isFullScreen });
    }
  }

  render() {
    const el = this.state.isFullScreen ?
      <img src={Minimize} alt="minimize screen" className={Style.icon} onClick={(e)=>this.clickHandler(e)} /> :
      <img src={ToFullScreen} alt="to full screen" className={Style.icon} onClick={(e)=>this.clickHandler(e)} />;
    return el;
  }
}