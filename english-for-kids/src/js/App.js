import MODES from './constatnts';
import cards from './cards';
import LeftMenu from './layouts/LeftMenu';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import MainContent from './layouts/MainContent';
import Router from './router/Router';
import routes from './router/routes';

export default class App {
  constructor() {
    this.cards = cards;
    this.leftMenu = new LeftMenu(Object.keys(cards));
    this.getCategories();
    this.header = new Header(() => this.leftMenu.toggleMenu(), (val) => { this.mode = val; });
    this.footer = new Footer();
    this.main = new MainContent();
    this.routerInit();
    this.mode = MODES.TRAIN;
    this.createPage();
    this.renderPage();
  }

  routerInit() {
    const initUrl = `${window.location.origin}/english-for-kids/`;
    this.router = new Router(initUrl, (params) => this.renderPage(params));
    routes.forEach((el) => this.router.add(el.path, el.handler));
    this.router.navigate('/');
    this.router.listen();
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

  renderPage(params) {
    const page = new this.router.Page();
    console.log(page, params);
    if (page.name === 'main page') {
      page.init(
        this.categories,
        null
        /*(pageClass, categoryName) => {
          this.routerGo(pageClass, categoryName);
        },
        PAGES.CATEGORY,*/
      );
    } else if (page.name === 'category page') {
      page.init(cards[params.name], null, params.name);
    }
    this.main.content = page.content;
  }
}
