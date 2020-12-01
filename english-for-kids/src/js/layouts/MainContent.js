import create from '../utils/create';

export default class MainContent {
  constructor() {
    this.main = create('main', 'main');
    this.mainContainer = create('div', 'container', null, this.main);
  }

  set content(val) {
    this.mainContainer.innerHTML = '';
    if (Array.isArray(val)) {
      val.forEach((el) => this.mainContainer.append(el));
    } else {
      this.mainContainer.append(val);
    }
  }
}
