import create from '../utils/create';

export default class LeftMenu {
  constructor(categories) {
    this.categories = categories;
    this.menu = null;
    this.menuContainer = null;
    this.createHtmlContainer();
    this.createMenu();
  }

  toggleMenu() {
    const menuClasses = this.menu.classList;
    if (menuClasses.contains('closed')) {
      this.menu.classList.remove('closed');
      this.menu.classList.add('opened');
    } else {
      this.menu.classList.remove('opened');
      this.menu.classList.add('closed');
    }
  }

  createHtmlContainer() {
    this.menu = create('nav', 'left-menu closed');
    this.menuContainer = create('ul', 'menu', null, this.menu);
  }

  handleRoute(params) {
    const name = params && params.name ? params.name : 'main';
    Array.from(this.menuContainer.children).forEach((el) => {
      if (el.dataset.name === name) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  createMenu() {
    this.addLinkToMainPage();

    this.categories.forEach((category) => {
      const routeParams = {
        name: category,
        path: 'category',
        params: {
          categoryName: category,
        },
      };
      const liElement = create(
        'li',
        'menu-link',
        null,
        this.menuContainer,
        ['name', category],
        ['route', JSON.stringify(routeParams)],
      );
      liElement.textContent = category;
    });
  }

  addLinkToMainPage() {
    const routeParams = {
      name: 'main',
      path: '/',
      params: {
        categoryName: 'main',
      },
    };
    const liElement = create(
      'li',
      'menu-link',
      null,
      this.menuContainer,
      ['name', 'main'],
      ['route', JSON.stringify(routeParams)],
    );
    liElement.textContent = 'Main';
  }
}
