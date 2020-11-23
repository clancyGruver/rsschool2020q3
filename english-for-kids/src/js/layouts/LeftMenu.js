import create from '../utils/create';

export default class LeftMenu {
  constructor(categories) {
    this.categories = categories;
    this.menu = null;
    this.menuContainer = null;
    this.createHtmlContainer();
    this.createMenu();
  }

  createHtmlContainer() {
    this.menu = create('nav', 'left-menu closed');
    this.menuContainer = create('ul', 'left-menu', null, this.menu);
  }

  createMenu() {
    this.categories.forEach((category) => {
      const liElement = create('li', 'menu-link', null, this.menuContainer);
      liElement.textContent = category;
    });
  }
}
