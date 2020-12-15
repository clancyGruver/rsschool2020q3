import React from 'react';

export default class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  choosePeriodSelect() {
    return <select value={this.props.period} onChange={this.props.setPeriod} className="form-control form-control-sm">
      <option value="lastDay">Последний день</option>
      <option value="all">Весь период</option>
    </select>
  }

  choosepeopleSelect() {
    return <select value={this.props.people} onChange={this.props.setPeople} className="form-control form-control-sm">
      <option value="abs">Абсолютные величины</option>
      <option value="100" disabled={typeof this.props.country === 'string'}>На 100 тыс. населения</option>
    </select>
  }

  statisticTable() {
    if(this.props.statisticValues){
      const keys = Object.keys(this.props.statisticValues).filter((el) => el.startsWith(this.props.period === 'all' ? 'Total' : 'New'));
      const rows = keys.map((key) => <tr key={key}>
        <th scope="col">{this.props.params[key]}</th>
        <th scope="col">{this.props.statisticValues[key]}</th>
      </tr>);
      return <table className="table">
        <tbody>
          {rows}
        </tbody>
      </table>
    }
    return <h4>Нет данных</h4>;
  }

  render() {
    return <div>
      <h4>Статистика {this.props.country.Country}</h4>
      {this.choosePeriodSelect()}
      {this.choosepeopleSelect()}
      {this.statisticTable()}
    </div>;
  }
}
