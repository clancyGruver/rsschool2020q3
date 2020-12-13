import React from 'react';
import icon from '../assets/images/icon.png';
import styles from '../styles/Header.module.css';

export default class Header extends React.Component {
  state = {
    name: 'covid-19 dashboard',
  }

  render() {
    return (
      <header className="header">
        <h1 className="text-uppercase">
          <img src={icon} alt="covid-19 dashboard icon" className={styles.icon} />
          {this.state.name}
        </h1>
      </header>
    )
  }
}