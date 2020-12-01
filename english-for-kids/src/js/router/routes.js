import MainPage from '../layouts/Main';
import CategoryPage from '../layouts/Category';

const StaisticsPage = () => {};

export default [
  {
    name: 'main',
    path: '/',
    handler: MainPage,
  },
  {
    name: 'statistics',
    path: 'statistics',
    handler: StaisticsPage,
  },
  {
    name: 'category',
    path: 'category',
    handler: CategoryPage,
  },
];
