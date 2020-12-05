import MainPage from '../layouts/Main';
import CategoryPage from '../layouts/Category';
import StatisticPage from '../layouts/Statistic';

export default [
  {
    name: 'main',
    path: '/',
    handler: MainPage,
  },
  {
    name: 'statistics',
    path: 'statistics',
    handler: StatisticPage,
  },
  {
    name: 'category',
    path: 'category',
    handler: CategoryPage,
  },
];
