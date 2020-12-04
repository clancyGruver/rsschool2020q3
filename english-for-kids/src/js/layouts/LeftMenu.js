import create from '../utils/create';

export default class LeftMenu {
  constructor(categories, icons) {
    this.icons = icons;
    this.categories = categories;
    this.menu = null;
    this.menuContainer = null;
    this.createHtmlContainer();
    this.createMenu();
    this.createOverlay();
  }

  createOverlay() {
    this.overlay = create('div', 'overlay', null, document.body);
  }

  showOverlay() {
    this.overlay.classList.add('show');
  }

  hideOverlay() {
    this.overlay.classList.remove('show');
  }

  toggleMenu() {
    const menuClasses = this.menu.classList;
    if (menuClasses.contains('closed')) {
      LeftMenu.stopScrolling();
      this.showOverlay();
      this.menu.classList.remove('closed');
      this.menu.classList.add('opened');
    } else {
      LeftMenu.startScrolling();
      this.hideOverlay();
      this.menu.classList.remove('opened');
      this.menu.classList.add('closed');
    }
  }

  static startScrolling() {
    document.body.classList.remove('stop-scrolling');
  }

  static stopScrolling() {
    document.body.classList.add('stop-scrolling');
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
      liElement.innerHTML = `${LeftMenu.createIcon(this.icons[category])} ${category}`;
    });
    this.addLinkToStaisticsPage();
  }

  addCloseHandler(headerMenuHandler) {
    Array.from(this.menuContainer.children).forEach((el) => {
      el.addEventListener('click', () => {
        headerMenuHandler();
        this.toggleMenu();
      });
    });
    this.addOverlayCloseHandler(headerMenuHandler);
  }

  addOverlayCloseHandler(headerMenuHandler) {
    this.overlay.addEventListener('click', () => {
      headerMenuHandler();
      this.toggleMenu();
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
    liElement.innerHTML = `${LeftMenu.createIcon('fa-home')} Main`;
  }

  addLinkToStaisticsPage() {
    const routeParams = {
      name: 'statistics',
      path: 'statistics',
      params: {
        categoryName: 'statistics',
      },
    };
    const liElement = create(
      'li',
      'menu-link',
      null,
      this.menuContainer,
      ['name', 'statistics'],
      ['route', JSON.stringify(routeParams)],
    );
    liElement.innerHTML = `${LeftMenu.createIcon('fa-chart-line')} Statistics`;
  }

  static createIcon(iconName) {
    return `<i class="fas ${iconName}"></i>`;
  }
}
