import React from 'react';
import Style from '../styles/Footer.module.css';
import GitHubIcon from '../assets/images/iconmonstr-github-1.svg';
import RSSIcon from '../assets/images/rs_school_js.svg';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className={`${Style.footer} bg-light`}>
        <div className="container">
          <ul className={Style.links}>
            <li className={Style.link}>
              <a href="https://github.com/clancyGruver">
                <img className={Style.githubImg} src={GitHubIcon} alt="github" />
              </a>
            </li>
            <li className={Style.link}>
              <strong>2020</strong>
            </li>
            <li className={Style.link}>
              <a href="https://rs.school/js/">
                <img className={Style.rssImg} src={RSSIcon} alt="rs school" />
              </a>
            </li>
          </ul>
        </div>
    </footer>
    );
  }
}