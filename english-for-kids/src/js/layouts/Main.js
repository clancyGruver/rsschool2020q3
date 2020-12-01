import Card from './Card';

export default class MainPage {
  constructor() {
    this.name = 'main page';
    this.contentVal = [];
  }

  init(categories) {
    this.content = categories.map((category) => {
      const card = new Card(category);
      card.createCategoryLink();
      return card;
    });
  }

  get content() {
    return this.contentVal;
  }

  set content(val) {
    val.forEach((element) => {
      this.contentVal.push(element.card);
    });
  }
}
