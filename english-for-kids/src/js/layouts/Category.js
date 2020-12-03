import CategoryCard from './CategoryCard';
import create from '../utils/create';
import MODES from '../constatnts';

export default class MainPage {
  constructor() {
    this.name = 'category page';
    this.cards = [];
  }

  init(words, mode) {
    this.words = words;
    this.cards = [];
    this.mode = mode;
    this.createCards();
    this.createRating();
  }

  changeMode(mode) {
    this.mode = mode;
    this.setRatingVisibility();
  }

  get content() {
    const cards = this.cards.map((el) => el.deck);
    return [
      this.rating,
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
      this.cards.push(new CategoryCard(word, () => this.mode));
    });
  }

  createRating() {
    this.rating = create('div', 'rating');
    this.setRatingVisibility();
  }

  setRatingVisibility() {
    if (this.mode === MODES.TRAIN) {
      this.rating.classList.add('hidden');
    } else {
      this.rating.classList.remove('hidden');
    }
  }
}
