import React from 'react';
import { Bar } from 'react-chartjs-2';

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.chartData,
      label: props.label || 'cases',
    };
  }

  render() {
    const chratData = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: this.state.label,
          data: [
            {
              x: new Date("2015-3-15"),
              y: 12
            },
            {
              x: new Date("2015-3-16"),
              y: 21
            },
            {
              x: new Date("2015-4-17"),
              y: 32
            },
            {
              x: new Date("2015-4-18"),
              y: 64
            },
            {
              x: new Date("2015-4-19"),
              y: 128
            },
            {
              x: new Date("2015-4-20"),
              y: 256
            },
            {
              x: new Date("2015-4-21"),
              y: 512
            },
          ],
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

    return <Bar data={chratData} options={options} />
  }
}