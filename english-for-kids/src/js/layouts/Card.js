import create from '../utils/create';

export default class Card {
  constructor(params) {
    this.urlPrefix = './assets/';
    this.params = params;
    this.createCardElement();
    this.createImageContainer();
    this.createDescriptionContainer();
    this.createDescription();
  }

  createCardElement() {
    this.cardElement = create('div', 'card-container');
  }

  createImageContainer() {
    this.imageContainer = create('div', 'card-image', null, this.card);
    this.imageContainer.style.backgroundImage = `url("${this.urlPrefix}${this.params.image}")`;
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

  createCategoryLink() {
    const routeParams = {
      name: this.params.word,
      path: 'category',
      params: {
        categoryName: this.params.word,
      },
    };
    this.cardElement.dataset.route = JSON.stringify(routeParams);
  }
}
