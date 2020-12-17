import React from 'react';

export default class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
      <h4>Статистика {this.props.country.Country || this.props.country}</h4>
      {this.statisticTable()}
    </div>;
  }
}
