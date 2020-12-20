import React from 'react';
import Header from './components/Header';
import Countries from './components/Countries';
import Chart from './components/Chart';
import Statistics from './components/Statistics';
import Map from './components/Map';

// import summaryData from './data/summary';
import worldChartData from './data/worldGraph';


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
          description: 'последний день',
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
      countries: [],
      covidData: null,
      country: 'Весь мир',
      statisticValues: null,
      population: null,
      selectedParam: {
        dataKey: 'TotalConfirmed',
        appKey: 'Confirmed',
        name: 'подтверждено',
      },
      params: {
        Confirmed: 'подтверждено',
        Deaths: 'умерло',
        Recovered: 'выздоровело',
      },
      peopleVal: 'abs',
      date: new Date(),
      graphValues: [],
      worldChartData: [],
      mapData: [],
      scaleValues: {
        none: 0, // 10%
        low: 0, // 30%
        medium: 0, //30%
        high: 0, // 30%
      },
    };
    this.updateCountry = this.updateCountry.bind(this);
    this.setShowingParam = this.setShowingParam.bind(this);
    this.peopleChange = this.peopleChange.bind(this);
    this.periodChange = this.periodChange.bind(this);
    this.per100 = this.per100.bind(this);
  }

  peopleChange() {
    const currentPeopleValue = Number(!Boolean(this.state.currentPeopleValue));
    this.setState({ currentPeopleValue }, () => this.updateData());
  }

  periodChange() {
    const currentPeriod = Number(!Boolean(this.state.currentPeriod));
    this.setState({ currentPeriod }, () => {
      this.setShowingParam(this.state.selectedParam.appKey);
      this.updateData()
    });
  }

  updateCountry(countryName) {
    const country = this.state.countries.find(country => {
      const slugEquals = country.Slug.toLowerCase() === countryName.toLowerCase();
      const nameEquals = country.Country.toLowerCase() === countryName.toLowerCase();
      return slugEquals || nameEquals;
    }) || 'Весь мир';
    this.setState({ country }, () => this.updateData());
  }

  setShowingParam(key) {
    const paramKey = `${this.state.currentPeriod === 0 ? 'Total' : 'New'}${key}`;
    this.setState({
      selectedParam: {
        dataKey: paramKey,
        appKey: key,
        name: this.state.params[key],
      }
    }, () => this.updateData());
  }

  updateData() {
    this.updateStatisticData();
    this.updateChartData();
    this.updateMapData();
  }

  per100(countryName, cases) {
    const peopleCount = this.state.population.find((el) => el.name === countryName);
    const population = peopleCount ? peopleCount.population : 7.8 * (10 ** 9);
    return (cases / population * 100_000).toFixed(2);
  }

  getCaseValues(minMaxCases) {
    const values = {
      none: 0, // 10%
      low: 0, // 30%
      medium: 0, //30%
      high: 0, // 30%
    };
    const onePercent = (minMaxCases.max - minMaxCases.min) / 100;
    values.none = Math.floor(minMaxCases.min + onePercent * 10);
    values.low = Math.round(minMaxCases.min + onePercent * 40);
    values.medium = Math.round(minMaxCases.min + onePercent * 70);
    values.high = minMaxCases.max;
    return values;
  }

  updateMapData() {
    const localCountries = this.state.countries;
    const minMaxCases = {
      min: 0,
      max: 0,
    };
    const mapData = localCountries.map(country => {
      let cases = country[this.state.selectedParam.dataKey];
      cases = this.state.currentPeopleValue === 1 ? this.per100(country.Country, cases) : cases
      if (cases < minMaxCases.min) minMaxCases.min = cases;
      if (cases > minMaxCases.max) minMaxCases.max = cases;
      const marker = {
        value: cases,
        countryName: country.Country,
        countrySlug: country.Slug,
        paramName: this.state.selectedParam.name,
      };
      this.state.population.find((el) => el.name === this.state.country.Country);
      return marker;
    });

    this.setState({
      mapData,
      scaleValues: this.getCaseValues(minMaxCases),
    })
  }

  updateChartData() {
    let chartData = null;
    const paramKey = this.state.selectedParam.dataKey;
    if (typeof this.state.country === 'object') {
      chartData = this.loadCountryChartData(this.state.country.Slug);
      chartData.then(el => console.log(el));
    } else if (typeof this.state.country === 'string') {
      chartData = JSON.parse(JSON.stringify(this.state.worldChartData));
      const date = new Date(Date.parse(chartData[0].date));
      this.setState({
        graphValues: chartData
          .sort((a, b) => a[paramKey] - b[paramKey])
          .map(el => {
            el.date = new Date(date.getTime());
            const chartVal = {
              x: el.date,
              y: el[paramKey],
            };
            date.setDate(date.getDate() + 1);
            return chartVal;
          }),
      })
    }/*

    if (this.state.currentPeopleValue === 1) {
      const peopleCount = this.state.population.find((el) => el.name === this.state.country.Country);
      const population = peopleCount ? peopleCount.population : 7.8 * (10 ** 9);
      if (population) {
        const keyPrefix = this.state.currentPeriod === 0 ? 'Total' : 'New';
        const keys = Object.keys(this.state.params);
        const res = {};
        keys.map((key) => res[`${keyPrefix}${key}`] = (countryData[`${keyPrefix}${key}`] / population * 100_000).toFixed(2));
        this.setState({ statisticValues: res});
      }
    } else if (this.state.currentPeopleValue === 0) {
      this.setState({ statisticValues: countryData });
    }*/
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
    if (this.state.currentPeopleValue === 1) {
      const keyPrefix = this.state.currentPeriod === 0 ? 'Total' : 'New';
      const keys = Object.keys(this.state.params);
      const res = {};
      const countryName = this.state.country.Country;
      keys.forEach((key) => {
        const cases = countryData[`${keyPrefix}${key}`];
        res[`${keyPrefix}${key}`] = this.per100(countryName, cases);
      });
      this.setState({ statisticValues: res});
    } else if (this.state.currentPeopleValue === 0) {
      this.setState({ statisticValues: countryData });
    }
  }

  async loadCountryChartData(slug) {
    const url = `${this.state.url}dayone/country/${slug}/status/${this.state.selectedParam.appKey.toLowerCase()}`;
    const response = await fetch(url);
    return await response.json();
  }

  async loadPopulation() {
    const url = 'https://restcountries.eu/rest/v2/all?fields=name;population';
    const response = await fetch(url);
    const population = await response.json();
    this.setState({ population });
  }

  async loadWorldData(){
    // const path = 'world';
    // const endDate = new Date();
    const startDate = new Date(2020, 3, 14);
    /*const url = `${this.state.url}${path}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`;
    const response = await fetch(url);
    const worldData = await response.json();*/
    const date = startDate;
    const paramKey = this.state.selectedParam.dataKey;
    const worldData = worldChartData
      .sort((a, b) => a[paramKey] - b[paramKey])
      .map(el => {
        el.date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
        return el;
      });
    this.setState({
      worldChartData: worldData,
      graphValues: worldData.map(el => {
        return {
          x: el.date,
          y: el[paramKey],
        };
      }),
    });
  }

  async loadSummary() {
    const url = `${this.state.url}summary`;
    const response = await fetch(url, {mode: 'cors',});
    const summaryData = await response.json();
    this.setState({
      summaryData,
      statisticValues: summaryData.Global,
      countries: summaryData.Countries,
      date: new Date(summaryData.Date),
    });
  }

  async componentDidMount() {
    await this.loadSummary();
    await this.loadPopulation();
    this.updateMapData();
    this.loadWorldData();
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
    const emptyCountries = [{
      "Country": "Идет загрузка",
      "CountryCode": "AX",
      "Slug": "ala-aland-islands",
      "NewConfirmed": 0,
      "TotalConfirmed": 0,
      "NewDeaths": 0,
      "TotalDeaths": 0,
      "NewRecovered": 0,
      "TotalRecovered": 0,
      "Date": "2020-04-05T06:37:00Z"
    },];
    return (
      <div className="container-fluid">
        <div className="row">
          <Header
            date={this.state.date}
            period={period}
            people={people}
            params={this.state.params}
            selectedParam={this.state.selectedParam}
            setShowingParam={this.setShowingParam}
          />
        </div>
        <div className="row">
          <div className="col-2">
            <Countries
              data={this.state.summaryData && this.state.summaryData.Countries ? this.state.summaryData.Countries : emptyCountries}
              selectedCountry={this.state.country}
              selectedParam={this.state.selectedParam}
              updateCountry={this.updateCountry}
              per100={this.state.currentPeopleValue}
              per100Fn={this.per100}
            />
          </div>
          <div className="col-6">
            <Map
              markers={this.state.mapData || this.state.countries}
              updateCountry={this.updateCountry}
              scaleValues={this.state.scaleValues}
            />
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
            <div className="row"><Chart
              values={this.state.graphValues}
              label={this.state.selectedParam.name}
            /></div>
          </div>
        </div>
      </div>
    )
  };
}
