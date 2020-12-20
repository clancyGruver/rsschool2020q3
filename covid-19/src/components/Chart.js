import React from 'react';
import FullScreen from './FullScreen';
import { Bar } from 'react-chartjs-2';

export default class Chart extends React.Component {
  render() {
    const chartData = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: this.props.label || 'cases',
          data: this.props.values,
          backgroundColor: 'rgba(253, 86, 2, 0.9)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 0,
        },
      ],
    };

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                if(value < 1000) return value;
                else if (value < 100000) return `${value / 1_000}K`;
                else return `${value / 1_000_000}M`;
              },
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            time: {
                unit: 'day',
                displayFormats: {
                  week: 'll',
                }
            },
            distribution: 'series',
          }
        ],
      },
    }

    return (
      <div>
        <FullScreen />
        <Bar data={chartData} options={options} />
      </div>
    )
  }
}