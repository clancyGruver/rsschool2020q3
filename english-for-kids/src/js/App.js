import {MODES} from './constatnts';
import cards from './cards';
import LeftMenu from './LeftMenu';
import Header from './Header';
import Footer from './layouts/Footer';
import MainContent from './layouts/MainContent';

export default class App {

  constructor() {
    this.mode = MODES.TRAIN;
    this.cards = cards;
    this.categories = Object.keys(cards);
    this.leftMenu = new LeftMenu(this.categories);
    this.header = new Header();
    this.footer = new Footer();
    this.main = new MainContent();
    this.createPage();
  }
  
  createPage() {
    document.body.append(this.header.header);
    document.body.append(this.leftMenu.menu);
    document.body.append(this.leftMenu.main);
    document.body.append(this.footer.footer);
  }

}
