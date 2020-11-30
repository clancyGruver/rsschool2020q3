import MainPage from '../layouts/Main';

const StaisticsPage = () => {};

export default [
  {
    name: 'main',
    path: '/',
    handler: MainPage,
  },
  {
    name: 'statistics',
    path: '/statistics',
    handler: StaisticsPage,
  },
  {
    name: 'cards',
    path: '/statistics',
    handler: StaisticsPage,
  },
];
