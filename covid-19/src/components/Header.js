import React from 'react';
import Switch from './Switch';
import ParamSelect from './ParamSelect';

import icon from '../assets/images/icon.png';
import Style from '../styles/Header.module.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'covid-19 dashboard',
    };
  }

  formatDate() {
    const addZero = (num)  => num * 1 < 10 ? `0${num}` : num;
    const {date} = this.props;
    const month = date.getUTCMonth() + 1;
    return `${date.getUTCFullYear()}-${addZero(month)}-${addZero(date.getUTCDate())}`;
  }

  render() {
    return (
      <header className={`${Style.headerCustom} header bg-light d-flex justify-content-center align-items-center`}>
        <div className="container row">
          <div className="name col">
            <h1 className="text-uppercase">
                <img src={icon} alt="covid-19 dashboard icon" className={Style.icon} />
                {this.state.name}
            </h1>
            <h6>По состоянию на {this.formatDate()}</h6>
          </div>
          <div className="col d-flex flex-column align-items-end">
            <Switch
              handleClick={this.props.period.handleClick}
              value={this.props.period.value}
              description={this.props.period.description}
            />
            <Switch
              handleClick={this.props.people.handleClick}
              value={this.props.people.value}
              description={this.props.people.description}
            />
            <ParamSelect
              params={this.props.params}
              setShowingParam={this.props.setShowingParam}
              selectedParam={this.props.selectedParam}
            />
          </div>
        </div>
      </header>
    )
  }
}