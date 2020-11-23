import {MODES} from './constatnts';
import cards from './cards';
import LeftMenu from './LeftMenu';
import Header from './Header';
import Footer from './layouts/Footer';

export default class App {

  constructor() {
    this.mode = MODES.TRAIN;
    this.cards = cards;
    this.categories = Object.keys(cards);
    this.leftMenu = new LeftMenu(this.categories);
    this.header = new Header(this.categories);
    this.footer = new Footer(this.categories);
    this.createPage();
  }
  
  createPage() {
    document.body.append(this.header.header);
    document.body.append(this.leftMenu.menu);
    document.body.append(this.footer.footer);
  }

}
