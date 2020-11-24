import Card from './Card';

export default class MainPage {
  constructor() {
    this.name = 'main page';
    this.contentVal = [];
  }

  init(categories, calbackFn, pageClass) {
    this.pageClass = pageClass;
    this.callback = calbackFn;
    this.content = categories.map((category) => new Card(category));
  }

  get content() {
    return this.contentVal;
  }

  set content(val) {
    val.forEach((element) => {
      this.contentVal.push(element.card);
      element.card.addEventListener('click', () => {
        this.callback(this.pageClass, element.params.word);
      });
    });
  }
}
