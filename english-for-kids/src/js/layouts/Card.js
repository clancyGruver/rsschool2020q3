import create from '../utils/create';

export default class Card {
  constructor(params) {
    this.urlPrefix = './assets/';
    this.params = params;
    this.createCardElement();
    this.createImageContainer();
    this.createImage();
    this.createDescriptionContainer();
    this.createDescription();
  }

  createCardElement() {
    this.cardElement = create('div', 'card-container');
  }

  createImageContainer() {
    this.imageContainer = create('div', 'card-image', null, this.card);
  }

  createImage() {
    this.image = create(
      'img',
      '',
      null,
      this.imageContainer,
      [
        'src',
        `${this.urlPrefix}${this.params.image || 'img/boot.jpg'}`,
      ],
      [
        'alt',
        this.params.word || 'boot',
      ],
    );
  }

  createDescriptionContainer() {
    this.descriptionContainer = create('div', 'card-description', null, this.card);
  }

  createDescription() {
    this.description = create('strong', '', null, this.descriptionContainer);
    this.description.textContent = this.params.word || 'boot';
  }

  get card() {
    return this.cardElement;
  }
}
