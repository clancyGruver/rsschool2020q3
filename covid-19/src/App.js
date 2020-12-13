import React from 'react';
import Header from './components/Header';
import Countries from './components/Countries';


export default class App extends React.Component {
  state = {
    url: 'https://api.covid19api.com/',
    countries: null,
    loading: true,
    covidData: null,
    country: 'all'
  }

  setCountry(country) {
    this.setState({ country });
  }

  async initAllCountries() {
    const url = `${this.state.url}countries`;
    const response = await fetch(url);
    const countries = await response.json();
    this.setState({ countries });
  }

  async loadSummary() {
    const url = `${this.state.url}summary`;
    const response = await fetch(url);
    const summaryData = await response.json();
    this.setState({ summaryData });
    console.log(summaryData);
  }

  async loadAll() {
    const url = `${this.state.url}all`;
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ data });
    console.log(data);
  }

  componentDidMount() {
    this.loadSummary();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <Header />
        </div>
        <div className="row">
          <div className="col-2">
            <Countries data={this.state.summaryData && this.state.summaryData.Countries ? this.state.summaryData.Countries : null} />
          </div>
          <div className="col-6">
            map
          </div>
          <div className="col-4">
            <div className="row">statistics</div>
            <div className="row">chart</div>
          </div>
        </div>
        { this.state.loading ? (<div>Loading...</div>) : (<div>{this.state.covidData.Date}</div>) }
      </div>
    )
  };
}
