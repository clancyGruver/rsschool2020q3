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
      periods: {
        0: {
          name: 'all',
          description: 'весь период',
        },
        1: {
          name: 'lastDay',
          description: 'Последний день',
        },
      },
      currentPeriod: 0,
      peopleValues:{
        0: {
          name: 'abs',
          description: 'абсолютные показатели',
        },
        1: {
          name: '100',
          description: 'на 100 тыс.',
        },
      },
      currentPeopleValue:0,
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
        NewConfirmed: 'подтвержденные за день',
        NewDeaths: 'смерти за день',
        NewRecovered: 'выздоровевшии за день',
        TotalConfirmed: 'всего подтверждено',
        TotalDeaths: 'всего умерло',
        TotalRecovered: 'всего выздоровело',
      },
      peopleVal: 'abs',
      date: new Date(),
    }
    this.updateCountry = this.updateCountry.bind(this);
    this.setShowingParam = this.setShowingParam.bind(this);
    this.peopleChange = this.peopleChange.bind(this);
    this.periodChange = this.periodChange.bind(this);
    this.getPopulation();
  }

  peopleChange() {
    const currentPeopleValue = Number(!Boolean(this.state.currentPeopleValue));
    this.setState({ currentPeopleValue }, () => this.updateStatisticData());
  }

  periodChange() {
    const currentPeriod = Number(!Boolean(this.state.currentPeriod));
    this.setState({ currentPeriod });
    this.updateStatisticData();
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

  updateStatisticData() {
    let countryData = null;
    if (typeof this.state.country === 'object') { 
      countryData = this.state.countries.find((el) => el.CountryCode === this.state.country.CountryCode);
    } else if (typeof this.state.country === 'string') {
      countryData = this.state.summaryData.Global;
      countryData.Date = this.state.summaryData.Date;
    }
    this.setState({ date: new Date(countryData.Date) });
    console.log(this.state.currentPeopleValue);
    if (this.state.currentPeopleValue === 1) {
      const peopleCount = this.state.population.find((el) => el.name === this.state.country.Country);
      const population = peopleCount ? peopleCount.population : 7.8 * (10 ** 9);
      if (population) {
        const keys = Object.keys(this.state.params);
        const res = {};
        keys.map((key) => res[key] = (countryData[key] / population * 100_000).toFixed(2));
        this.setState({ statisticValues: res});
      }
    } else if (this.state.currentPeopleValue === 0) {
      this.setState({ statisticValues: countryData });
    }
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

  componentDidMount() {
    this.loadSummary();
  }

  render() {
    const period = {
      handleClick: this.periodChange,
      value: this.state.currentPeriod,
      description: this.state.periods[this.state.currentPeriod].description,
    };
    const people = {
      handleClick: this.peopleChange,
      value: this.state.currentPeopleValue,
      description: this.state.peopleValues[this.state.currentPeopleValue].description,
    };
    return (
      <div className="container-fluid">
        <div className="row">
          <Header
            date={this.state.date}
            period={period}
            people={people}
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
                statisticValues={this.state.statisticValues}
                params={this.state.params}
                period={this.state.periods[this.state.currentPeriod].name}
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
