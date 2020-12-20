import React from 'react';
import Style from '../styles/Countries.module.css';

export default class CountriesList extends React.Component {
  liClickHandler(el) {
    let propSlug = null;
    if(this.props.selectedCountry && this.props.selectedCountry.Slug) 
      propSlug = this.props.selectedCountry.Slug;
    else 
      propSlug = '';
    if(el.Slug !== propSlug){
      this.props.updateCountry(el.Name);
    }
    else {
      this.props.updateCountry('Весь мир');
    }
  }

  createLi() {
    const countries = this.props.countries;
    return countries.map((el) => {
      const flag = `https://www.countryflags.io/${el.CountryCode}/flat/16.png`;
      const alt = `${el.Country} flag`;
      const selectedSlug = this.props.selectedCountry ? this.props.selectedCountry.Slug : 'none';
      return <li
        className={`list-group-element ${el.Slug === selectedSlug ? Style.active : ''}`}
        key={el.Slug}
        onClick={() => this.liClickHandler(el)}
      >
        <h6 className={Style.smallHeader}>
          <img src={flag} alt={alt}></img>
          {el.Country}
          &nbsp;
          <span className="text-danger">
            {el[this.props.selectedParam.dataKey]}
          </span>
        </h6>
      </li>;
    });
  }

  render() {
    return (<ul className={`${Style.overflow} list-group`}>
          {this.createLi()}
        </ul>);
  }
}