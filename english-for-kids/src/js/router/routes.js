import MainPage from '../layouts/Main';
import CategoryPage from '../layouts/Category';
import StaisticPage from '../layouts/Statistics';

export default [
  {
    name: 'main',
    path: '/',
    handler: MainPage,
  },
  {
    name: 'statistics',
    path: 'statistics',
    handler: StaisticPage,
  },
  {
    name: 'category',
    path: 'category',
    handler: CategoryPage,
  },
];
