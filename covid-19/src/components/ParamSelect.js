import React from 'react';
import Style from '../styles/ParamSelect.module.css';

export default class ParamSelect extends React.Component{
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    const key = e.target.value;
    this.props.setShowingParam(key);
  }

  createSelectOptions() {
    const paramKeys = Object.keys(this.props.params);
    return paramKeys.map((el) => <option value={el} key={el}>
      {this.props.params[el]}
      </option>);
  }

  render() {
    return (
      <select
        value={this.props.selectedParam.appKey}
        className={`${Style.wa} form-select form-select-sm`}
        onChange={this.handleSelect}
      >
        <option disabled>Параметр</option>
        {this.createSelectOptions()}
      </select>);
  }
}