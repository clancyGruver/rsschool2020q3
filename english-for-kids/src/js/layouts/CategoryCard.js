import create from '../utils/create';
import MODES from '../constatnts';
import Statistic from './Statistic';

export default class CategoryCard {
  constructor(params, mode) {
    this.urlPrefix = './assets/';
    this.params = params;
    this.mode = mode;
    this.image = {};
    this.description = {};

    this.createDeck();
    this.createFrontCard();
    this.createBackCard();

    this.addFlipButton();
    this.addPlayAudioHandler();
    this.addFlipHandler();
  }

  createDeck() {
    this.deck = create('div', 'flip-card');
    this.deckContainer = create('div', 'flip-card__container', null, this.deck);
  }

  createFrontCard() {
    this.front = create('div', 'flip-card__front', null, this.deckContainer);
    this.createImage(this.front, 'front');
    this.createDescription(this.front, this.params.word, 'front');
    this.createAudio();
  }

  createBackCard() {
    this.back = create('div', 'flip-card__back', null, this.deckContainer);
    this.createImage(this.back, 'back');
    this.createDescription(this.back, this.params.translation, 'back');
  }

  createImage(parentEl, side) {
    this.image[side] = create('div', 'card-image', null, parentEl);
    this.image[side].style.backgroundImage = `url(${this.urlPrefix}${this.params.image})`;
  }

  createDescription(parentEl, word = '', side) {
    this.description[side] = create('div', 'card-description', null, parentEl);
    const description = create('strong', '', null, this.description[side]);
    description.textContent = word || '';
  }

  addFlipHandler() {
    this.flipButton.addEventListener('click', () => this.flipToBack());
    this.deck.addEventListener('mouseleave', () => this.flipToFront());
  }

  createAudio() {
    this.audio = create('audio', '', null, this.front, ['src', `${this.urlPrefix}${this.params.audioSrc}`]);
  }

  addFlipButton() {
    this.flipButton = create('button', 'card-flip', null, this.front, ['type', 'button']);
    this.flipButton.innerHTML = '<i class="fas fa-redo-alt"></i>';
  }

  addPlayAudioHandler() {
    this.front.addEventListener('click', (e) => {
      if (this.mode() === MODES.PLAY) {
        return;
      }
      Statistic.trainClick(this.params.word);
      const flipBtn = Boolean(e.target.closest('.card-flip'));
      const front = Boolean(e.target.closest('.flip-card__front'));
      if (!flipBtn && front) {
        this.playSound();
      }
    });
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  flipToBack() {
    this.deck.classList.add('flipped');
    this.front.classList.add('hidden');
    this.back.classList.remove('hidden');
  }

  flipToFront() {
    this.deck.classList.remove('flipped');
    this.front.classList.remove('hidden');
    this.back.classList.add('hidden');
  }

  setInvisible() {
    this.deck.classList.add('small');
    this.image.front.classList.add('round');
    this.description.front.classList.add('non-displayed');
    this.flipButton.classList.add('non-displayed');
  }

  setVisible() {
    this.deck.classList.remove('small');
    this.image.front.classList.remove('round');
    this.description.front.classList.remove('non-displayed');
    this.flipButton.classList.remove('non-displayed');
  }
}
