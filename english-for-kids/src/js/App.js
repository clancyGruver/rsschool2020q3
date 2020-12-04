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
    this.header = new Header(
      () => this.leftMenu.toggleMenu(),
      (val) => this.changeMode(val),
    );
    this.footer = new Footer();
    this.main = new MainContent();
    this.routerInit();
    this.mode = MODES.TRAIN;
    this.createPage();
    this.renderPage();
    this.leftMenu.addCloseHandler(() => this.header.toggleMenu());
  }

  changeMode(val) {
    this.mode = val;
    if (this.page.name === 'category page') {
      this.page.changeMode(this.mode);
    }
  }

  routerInit() {
    const initUrl = `${window.location.origin}/english-for-kids/`;
    this.router = new Router(initUrl, (params) => {
      this.leftMenu.handleRoute(params);
      this.renderPage(params);
    });
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
    this.pageParams = params;
    this.page = new this.router.Page();
    if (this.page.name === 'main page') {
      this.page.init(this.categories);
    } else if (this.page.name === 'category page') {
      this.page.init(params.name, cards[params.name], this.mode, () => this.router.navigate('/'));
    }
    this.main.content = this.page.content;
  }
}
