import CategoryCard from './CategoryCard';
import Card from './Card';
import create from '../utils/create';

export default class MainPage {
  constructor() {
    this.name = 'category page';
    this.cards = [];
  }

  init(words, calbackFn, categoryName) {
    this.categoryName = categoryName;
    // this.pageClass = pageClass;
    this.callback = calbackFn;
    this.words = words;
    this.cards = [];
    this.createCards();
  }

  get content() {
    return [
      this.description,
      ...this.cards,
    ];
  }

  get description() {
    const description = create('div', 'description');
    const h1 = create('h1', 'description-text', null, description);
    h1.textContent = this.categoryName;

    return description;
  }

  createCards() {
    this.words.forEach((word) => {
      const holder = create('div', 'card-holder');
      const front = new CategoryCard(word);
      const back = new Card(word);

      back.card.classList.add('back');
      holder.append(front.card, back.card);

      this.cards.push(holder);
    });
  }
}
