import React from 'react';
import Header from './components/Header';
import Countries from './components/Countries';
import Chart from './components/Chart';
import Statistics from './components/Statistics';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://api.covid19api.com/',
      countries: null,
      loading: true,
      covidData: null,
      country: 'Весь мир',  
      statisticValues: null,    
      population: null,
      selectedParam: {
        key: 'TotalConfirmed',
        name: 'всего подтверждено',
      },
      params: {
        NewConfirmed: 'новые подтвержденные',
        NewDeaths: 'новые смерти',
        NewRecovered: 'новые выздоровевшии',
        TotalConfirmed: 'всего подтверждено',
        TotalDeaths: 'всего умерло',
        TotalRecovered: 'всего выздоровело',
      },
      peopleVal: 'abs',
      period: 'all',
      date: new Date(),
    }
    this.updateCountry = this.updateCountry.bind(this);
    this.setShowingParam = this.setShowingParam.bind(this);
    this.setPeopleValue = this.setPeopleValue.bind(this);
    this.setPeriod = this.setPeriod.bind(this);
    this.getPopulation();
  }

  async getPopulation() {
    const url = 'https://restcountries.eu/rest/v2/all?fields=name;population';
    const response = await fetch(url);
    const population = await response.json();
    this.setState({ population });
  }

  updateCountry(country) {
    this.setState({ country });
    this.updateStatisticData();
  }

  setShowingParam(key) {
    this.setState({
      selectedParam: {
        key: key,
        name: this.state.params[key],
      }
    });
  }

  setPeopleValue(val) {
    this.setState({ peopleVal: val.target.value });
    this.updateStatisticData();
  }

  setPeriod(period) {
    this.setState({ period: period.target.value });
  }

  updateStatisticData() {
    if (typeof this.state.country === 'object') {
      const countryData = this.state.countries.find((el) => el.CountryCode === this.state.country.CountryCode);
      if (this.state.peopleVal === '100') {
        const peopleCount = this.state.population.find((el) => el.name === this.state.country.Country);
        if (peopleCount) {
          const population = peopleCount.population;
          const keys = Object.keys(this.state.params);
          const res = {};
          keys.map((key) => res[key] = (countryData[key] / population * 100_000).toFixed(2));
          this.setState({ statisticValues: res});
        }
      } else if (this.state.peopleVal === 'abs') {
        this.setState({ statisticValues: countryData});
      }
    }    
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
    this.setState({
      summaryData,
      statisticValues: summaryData.Global,
      countries: summaryData.Countries,
      date: new Date(summaryData.Date),
    });
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
          <Header
            date={this.state.date}
          />
        </div>
        <div className="row">
          <div className="col-2">
            <Countries
              data={this.state.summaryData && this.state.summaryData.Countries ? this.state.summaryData.Countries : null}
              params={this.state.params}
              selectedParam={this.state.selectedParam}
              updateCountry={this.updateCountry}
              setShowingParam={this.setShowingParam}
            />
          </div>
          <div className="col-6">
            map
          </div>
          <div className="col-4">
            <div className="row">
              <Statistics
                country={this.state.country}
                setPeople={this.setPeopleValue}
                setPeriod={this.setPeriod}
                statisticValues={this.state.statisticValues}
                params={this.state.params}
                period={this.state.period}
                people={this.state.peopleVal}
              />
            </div>
            <div className="row"><Chart /></div>
          </div>
        </div>
        { this.state.loading ? (<div>Loading...</div>) : (<div>{this.state.covidData.Date}</div>) }
      </div>
    )
  };
}
