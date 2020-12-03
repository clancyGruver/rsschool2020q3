import CategoryCard from './CategoryCard';
import create from '../utils/create';
import MODES from '../constatnts';

export default class Category {
  constructor() {
    this.playModes = {
      waiting: 'waiting',
      playing: 'playing',
    };
    this.stars = {
      full: '<i class="fas fa-star fa-4x"></i>',
      empty: '<i class="far fa-star fa-4x"></i>',
    };
    this.icons = {
      repeat: '<i class="fas fa-redo"></i>Repeat',
      play: '<i class="fas fa-play"></i>Start game',
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
    this.createSuccessSound();
    this.createErrorSound();
    this.addSoundsToPanel();
    this.setVisibility();
  }

  changeMode(mode) {
    this.mode = mode;
    this.setVisibility();
    this.cards.forEach((card) => {
      if (this.mode === MODES.PLAY) {
        card.setInvisible();
        card.deck.addEventListener('click', (e) => this.playCardClickHandler(e)); // TODO: change handler for disabling on end game
      } else {
        card.setVisible();
      }
    });
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

  shuffle() {
    this.playCards = [...this.cards];
    for (let i = this.playCards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playCards[i], this.playCards[j]] = [this.playCards[j], this.playCards[i]];
    }
  }

  btnClickHandler() {
    if (this.playMode === null || this.playMode === this.playModes.waiting) {
      this.playMode = this.playModes.playing;
      this.setRepeatBtn();
      this.shuffle();
      this.nextPlayCard();
    } else {
      this.currentPlayCard.playSound();
    }
  }

  playCardClickHandler(e) {
    const el = e.target.closest('.flip-card');
    if (el === this.currentPlayCard.deck) {
      Category.playSound(this.successSound);
      this.nextPlayCard();
    } else {
      Category.playSound(this.errorSound);
    }
  }

  nextPlayCard() {
    this.currentPlayCard = this.playCards.pop();
    this.currentPlayCard.playSound();
  }

  createButtonsPanel() {
    this.panel = create('div', 'panel');
  }

  createButton() {
    this.createButtonsPanel();
    this.button = create('button', 'btn btn-start', null, this.panel);
    this.button.innerHTML = this.icons.play;
    this.button.addEventListener('click', () => this.btnClickHandler());
  }

  setRepeatBtn() {
    this.button.innerHTML = this.icons.repeat;
    this.button.classList.add('btn-repeat');
    this.button.classList.remove('btn-start');
  }

  setVisibility() {
    if (this.mode === MODES.TRAIN) {
      if (this.rating) this.rating.classList.add('non-displayed');
      if (this.panel) this.panel.classList.add('off');
    } else {
      if (this.rating) this.rating.classList.remove('non-displayed');
      if (this.panel) this.panel.classList.remove('off');
    }
  }

  createSuccessSound() {
    const soundUrl = './assets/sound/success.wav';
    this.successSound = Category.createSound(soundUrl);
  }

  createErrorSound() {
    const soundUrl = './assets/sound/error.wav';
    this.errorSound = Category.createSound(soundUrl);
  }

  addSoundsToPanel() {
    this.panel.appendChild(this.errorSound);
    this.panel.appendChild(this.successSound);
  }

  static createSound(soundUrl) {
    return create('audio', '', null, null, ['src', soundUrl]);
  }

  static playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
