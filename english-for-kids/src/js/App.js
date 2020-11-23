import { MODES, PAGES } from './constatnts';
import cards from './cards';
import LeftMenu from './layouts/LeftMenu';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import MainContent from './layouts/MainContent';

export default class App {
  constructor() {
    this.mode = MODES.TRAIN;
    this.cards = cards;
    this.leftMenu = new LeftMenu(Object.keys(cards));
    this.getCategories();
    this.header = new Header();
    this.footer = new Footer();
    this.main = new MainContent();
    this.Page = PAGES.MAIN;
    this.createPage();
    this.renderPage();
  }

  getCategories() {
    this.categories = [];
    const keys = Object.keys(cards);
    for (let i = 0; i < keys.length; i += 1) {
      const categoryName = cards[keys[i]];
      const cat = {
        image: cards[categoryName][0].image,
        word: categoryName,
      };
      this.categories.push(cat);
    }
  }

  createPage() {
    document.body.append(this.header.header);
    document.body.append(this.leftMenu.menu);
    document.body.append(this.main.main);
    document.body.append(this.footer.footer);
  }

  renderPage() {
    const page = new this.Page();
    if (page.name === 'main page') {
      page.init(this.categories);
    }
    this.main.content = page.content;
  }
}
