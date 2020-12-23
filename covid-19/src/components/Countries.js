import React from 'react';
import CountriesList from './CountriesList';
import Style from '../styles/Countries.module.css';
import FullScreen from './FullScreen';
export default class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };
    this.searchHandler = this.searchHandler.bind(this);
  }

  sortData() {
    const key = this.props.selectedParam.dataKey;
    const sortParam = key ? key : this.props.selectedParam.key;
    const sortFn = (a, b) => {
      const aVal = this.props.per100
        ? this.props.per100Fn(a.Country, a[sortParam])
        : a[sortParam];
      const bVal = this.props.per100
        ? this.props.per100Fn(b.Country, b[sortParam])
        : b[sortParam];
      return bVal - aVal;
    };
    const data = this.props.data.sort(sortFn);
    return data.filter((el) => el.Country.toLowerCase().includes(this.state.searchString));
  }

  searchHandler(e) {
    const searchString = e.target.value.toLowerCase();
    this.setState({ searchString });
  }

  render() {
    return (
      <>
        <FullScreen />
        <div className={Style.h80}>
          <div className={`${Style.mb6} input-group`}>
            <span className="input-group-text" id="Search">
              <i className="fas fa-search" aria-hidden="true"></i>
            </span>
            <input
              className="form-control"
              type="text"
              placeholder="Country"
              aria-label="Country"
              aria-describedby="Search"
              onChange={this.searchHandler}
              value={this.state.searchString}
            />
          </div>
          <CountriesList
            countries={this.sortData()}
            selectedCountry={this.props.selectedCountry}
            selectedParam={this.props.selectedParam}
            updateCountry={this.props.updateCountry}
            per100={this.props.per100}
            per100Fn={this.props.per100Fn}
          />
        </div>
      </>      
    );
  }
}
