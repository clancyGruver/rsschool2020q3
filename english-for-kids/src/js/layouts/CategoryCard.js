import Card from './Card';
import create from '../utils/create';

export default class CategoryCard extends Card {
  constructor(params) {
    super(params);
    this.createAudio();
    this.addFlipButton();
  }

  createAudio() {
    this.audio = create('audio', '', null, this.card, ['src', `${this.urlPrefix}${this.params.audioSrc}`]);
  }

  addFlipButton() {
    this.flipButton = create('button', 'card-flip', null, this.card, ['type', 'button']);
  }
}
