import React from 'react';
import Style from '../styles/Switch.module.css';

export default class Switch extends React.Component {
  render() {
    return (<div className={`${Style.pl0} form-check form-switch d-flex flex-row-invert`}>
      <label className="form-check-label">{this.props.description}</label>
      <input className={`${Style.formCheckInputCustom} form-check-input`} type="checkbox" checked={this.props.value} onChange={this.props.handleClick} />
    </div>);
  }
}