import { MODES, PAGES } from './constatnts';
import cards from './cards';
import LeftMenu from './layouts/LeftMenu';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import MainContent from './layouts/MainContent';

export default class App {
  constructor() {
    this.cards = cards;
    this.leftMenu = new LeftMenu(Object.keys(cards));
    this.getCategories();
    this.header = new Header(() => this.leftMenu.toggleMenu(), (val) => { this.mode = val; });
    this.footer = new Footer();
    this.main = new MainContent();
    this.Page = PAGES.MAIN;
    this.mode = MODES.TRAIN;
    this.createPage();
    this.renderPage();
  }

  routerGo(page, val) {
    this.Page = page;
    this.selectedCategory = val;
    this.renderPage(this.cards[val]);
  }

  set mode(val) {
    this.appMode = val;
    this.header.switcher = val === MODES.PLAY;
  }

  get mode() {
    return this.appMode;
  }

  getCategories() {
    this.categories = [];
    const keys = Object.keys(cards);
    for (let i = 0; i < keys.length; i += 1) {
      const categoryName = keys[i];
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

  renderPage(val) {
    const page = new this.Page();
    if (page.name === 'main page') {
      page.init(
        this.categories,
        (pageClass, categoryName) => {
          this.routerGo(pageClass, categoryName);
        },
        PAGES.CATEGORY,
      );
    } else if (page.name === 'category page') {
      page.init(val, null, this.selectedCategory);
    }
    this.main.content = page.content;
  }
}
