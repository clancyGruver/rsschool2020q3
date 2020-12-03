import CategoryCard from './CategoryCard';
import create from '../utils/create';
import MODES from '../constatnts';

export default class MainPage {
  constructor() {
    this.playModes = {
      waiting: 'waiting',
      playing: 'playing'
    };
    this.stars = {
      full: '<i class="fas fa-star fa-4x"></i>',
      empty: '<i class="far fa-star fa-4x"></i>',
    };
    this.playMode = null;
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
    this.setVisibility();
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
      this.panel,
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
    this.rating.innerHTML = `${this.stars.empty}${this.stars.full}`;
  }

  createButton() {
    this.createButtonsPanel();
    const playButton = '<i class="fas fa-play"></i>Start game';
    this.button = create('button', 'btn btn-start', playButton, this.panel);
    this.button.addEventListener('click', this.btnClickHandler);
  }

  btnClickHandler() {
    if(!this.playMode || this.playMode === this.playModes.playing) {

    }
    //'<i class="fas fa-redo"></i>Repeat'

  }

  createButtonsPanel() {
    this.panel = create('div', 'panel');
  }

  setVisibility() {
    if (this.mode === MODES.TRAIN) {
      if (this.rating) this.rating.classList.add('hidden');
      if (this.panel) this.panel.classList.add('off');
    } else {
      if (this.rating) this.rating.classList.remove('hidden');
      if (this.panel) this.panel.classList.remove('off');
    }
  }
}
