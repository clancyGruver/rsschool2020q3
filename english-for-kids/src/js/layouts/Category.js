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
    this.createButton();
  }

  changeMode(mode) {
    this.mode = mode;
    this.setVisibility();
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

  createButton() {
    this.createButtonsPanel();
    this.button = create('button', 'btn-start', null, this.panel);
  }

  createButtonsPanel() {
    this.panel = create('div', 'panel');
  }

  setVisibility() {
    if (this.mode === MODES.TRAIN) {
      if (this.rating) this.rating.classList.add('hidden');
      if (this.panel) this.panel.classList.add('hidden');
    } else {
      if (this.rating) this.rating.classList.remove('hidden');
      if (this.panel) this.panel.classList.remove('hidden');
    }
  }
}
