import CategoryCard from './CategoryCard';
import Card from './Card';
import create from '../utils/create';

export default class MainPage {
  constructor() {
    this.name = 'category page';
    this.cards = [];
  }

  init(words) {
    this.words = words;
    this.cards = [];
    this.createCards();
  }

  get content() {
    const cards = this.cards.map((el) => el.deck);
    return [
      this.description,
      ...cards,
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
      this.cards.push(new CategoryCard(word));
    });
  }
}
