import React from 'react';
import style from '../styles/Countries.module.css';

export default class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      readyData: null,
      searchString: '',
      params: {
        NewConfirmed: 'новые подтвержденные',
        NewDeaths: 'новые смерти',
        NewRecovered: 'новые выздоровевшии',
        TotalConfirmed: 'всего подтверждено',
        TotalDeaths: 'всего умерло',
        TotalRecovered: 'всего выздоровело',
      },
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  sortData(key = null) {
    const sortParam = key ? key : this.props.selectedParam.key;
    const sortFn = (a, b) => b[sortParam] - a[sortParam];
    if (this.state.data) {
      this.state.data.sort(sortFn);
    } else if (this.props.data) {
      const data = this.props.data.sort(sortFn);
      this.setState({ data });
    }
    this.setState({ readyData: this.state.data });
  }

  createSelectOptions() {
    const paramKeys = Object.keys(this.state.params);
    return paramKeys.map((el) => <option value={el} key={el}>
      {this.state.params[el]}
      </option>);
  }

  handleSelect(e) {
    const key = e.target.value;
    this.props.setShowingParam(key); 
    this.sortData(key);
    this.filter();
  }

  searchHandler(e) {
    const searchString = e.target.value.toLowerCase();
    this.setState({ searchString });
    this.filter();
  }

  filter() {
    const { data } = this.state;
    const filtered = data.filter((el) => el.Country.toLowerCase().includes(this.state.searchString));
    this.setState({
      readyData: filtered,
    });

  }

  createLi() {
    if (this.state.readyData || this.state.data) {
      const countries = this.state.readyData ? this.state.readyData : this.state.data;
      return countries.map((el) => {
        const flag = `https://www.countryflags.io/${el.CountryCode}/flat/16.png`;
        const alt = `${el.Country} flag`;
        return <li
          className="list-group-element"
          key={el.Slug}
          onClick={() => this.props.updateCountry(el)}
        >
          <h6 className={style.smallHeader}>
            <img src={flag} alt={alt}></img>
            {el.Country}
            &nbsp;
            <span className="text-danger">
              {el[this.props.selectedParam.key]}
            </span>
          </h6>
        </li>;
      });
    }

    return <p>loading...</p>;
  }

  render() {
    if (this.props.data && !this.state.data) this.sortData();
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
        <select value={this.props.selectedParam.key} className="form-select form-select-sm" onChange={this.handleSelect}>
          {this.createSelectOptions()}
        </select>
        <ul className="list-group">
          {this.createLi()}
        </ul>
      </div>
    );
  }
}
