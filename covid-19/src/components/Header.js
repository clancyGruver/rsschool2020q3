import React from 'react';
import icon from '../assets/images/icon.png';
import styles from '../styles/Header.module.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'covid-19 dashboard',
    };
  }

  formatDate() {
    const {date} = this.props;
    const month = date.getUTCMonth() + 1;
    return `${date.getUTCFullYear()}-${month}-${date.getUTCDate()}`
  }

  render() {
    return (
      <header className="header bg-light">
        <h1 className="text-uppercase">
            <img src={icon} alt="covid-19 dashboard icon" className={styles.icon} />
            {this.state.name}
        </h1>
        <h6>По состоянию на {this.formatDate()}</h6>
      </header>
    )
  }
}