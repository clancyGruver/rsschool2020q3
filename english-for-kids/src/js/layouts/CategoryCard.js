import create from '../utils/create';

export default class CategoryCard {
  constructor(params) {
    this.urlPrefix = './assets/';
    this.params = params;

    this.createDeck();
    this.creteFrontCard();
    this.creteBackCard();

    this.addFlipButton();
    this.addPlayAudioHandler();
    this.addFlipHandler();
  }

  createDeck() {
    this.deck = create('div', 'flip-card');
    this.deckContainer = create('div', 'flip-card__container', null, this.deck);
  }

  creteFrontCard() {
    this.front = create('div', 'flip-card__front', null, this.deckContainer);
    this.createImage(this.front);
    CategoryCard.createDescription(this.front, this.params.word);
    this.createAudio();
  }

  creteBackCard() {
    this.back = create('div', 'flip-card__back', null, this.deckContainer);
    this.createImage(this.back);
    CategoryCard.createDescription(this.back, this.params.translation);
  }

  createImage(parentEl) {
    const imageContainer = create('div', 'card-image', null, parentEl);
    create(
      'img',
      '',
      null,
      imageContainer,
      [
        'src',
        `${this.urlPrefix}${this.params.image || 'img/boot.jpg'}`,
      ],
      [
        'alt',
        this.params.word || '',
      ],
    );
  }

  static createDescription(parentEl, word = '') {
    const descriptionContainer = create('div', 'card-description', null, parentEl);
    const description = create('strong', '', null, descriptionContainer);
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
  }

  addPlayAudioHandler() {
    this.front.addEventListener('click', (e) => {
      const flipBtn = Boolean(e.target.closest('.card-flip'));
      const front = Boolean(e.target.closest('.flip-card__front'));
      if (!flipBtn && front) {
        this.audio.currentTime = 0;
        this.audio.play();
      }
    });
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
}
/*
<div class="flip-card">
  <div class="flip-card__container">

    <div class="flip-card__front">
      <div class="card-image">
        <img src="./assets/img/open.jpg" data-alt="open">
      </div>

      <div class="card-description">
        <strong>open</strong>
        <button class="card-flip" type="button"></button>
      </div>
      <audio src="./assets/audio/open.mp3"></audio>
    </div>

  </div>
  <div class="flip-card__back">
    <div class="card-image">
      <img src="./assets/img/open.jpg" data-alt="open">
    </div><div class="card-description">
      <strong>open</strong>
    </div>
  </div>

  </div>
</div>
*/