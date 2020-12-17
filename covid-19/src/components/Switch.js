import React from 'react';

export default class Switch extends React.Component {
  render() {
    return (<div className="form-check form-switch">
      <input className="form-check-input" type="checkbox" checked={this.props.value} onChange={this.props.handleClick} />
      <label className="form-check-label">{this.props.description}</label>
    </div>);
  }
}