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

  createMenu() {
    this.categories.forEach((category) => {
      const liElement = create('li', 'menu-link', null, this.menuContainer);
      liElement.textContent = category;
    });
  }
}
