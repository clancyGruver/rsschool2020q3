import create from './utils/create';

export default class Card{
    constructor(params) {
        this.card = create('div', 'card-container');
        this.imageContainer = create('div', 'card-image', null, this.card);
        this.image = create('img', '', null, this.imageContainer, ['src', params.image || './assets/img/boot.jpg'], ['alt', params.word || 'boot']);
        this.descriptionContainer = create('div', 'card-description', null, this.card);
        this.description = create('strong', '', null, this.descriptionContainer);
        this.description.textContent = params.word || 'boot';
    }
}