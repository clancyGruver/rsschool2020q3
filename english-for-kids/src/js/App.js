import {MODES} from './constatnts';
import cards from './cards';
import LeftMenu from './LeftMenu';

export default class App {

  constructor() {
    this.mode = MODES.TRAIN;
    this.cards = cards;
    this.categories = Object.keys(cards);
    this.leftMenu = new LeftMenu(this.categories);
    this.createPage();
  }
  
  createPage() {
    document.body.append(this.leftMenu.menu);
  }

}
