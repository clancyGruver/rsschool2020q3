import React from 'react';
import CountriesList from './CountriesList';

export default class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  sortData() {
    const key = this.props.selectedParam.dataKey;
    const sortParam = key ? key : this.props.selectedParam.key;
    const sortFn = (a, b) => b[sortParam] - a[sortParam];
    const data = this.props.data.sort(sortFn);
    return data.filter((el) => el.Country.toLowerCase().includes(this.state.searchString));
  }

  createSelectOptions() {
    const paramKeys = Object.keys(this.props.params);
    return paramKeys.map((el) => <option value={el} key={el}>
      {this.props.params[el]}
      </option>);
  }

  handleSelect(e) {
    const key = e.target.value;
    this.props.setShowingParam(key); 
  }

  searchHandler(e) {
    const searchString = e.target.value.toLowerCase();
    this.setState({ searchString });
  }

  render() {
    return (
      <div>
        <div className="input-group">
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
        <select value={this.props.selectedParam.appKey} className="form-select form-select-sm" onChange={this.handleSelect}>
          {this.createSelectOptions()}
        </select>
        <CountriesList
          countries={this.sortData()}
          selectedCountry={this.props.selectedCountry}
          selectedParam={this.props.selectedParam}
          updateCountry={this.props.updateCountry}
        />
      </div>
    );
  }
}
