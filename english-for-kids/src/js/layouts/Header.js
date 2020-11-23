import create from '../utils/create';

export default class Header {
  constructor(menuHandler, toggleHandler) {
    this.header = create('header', 'header');
    this.headerContainer = create('div', 'container', null, this.header);
    this.createBurgerMenu(menuHandler);
    this.createName();
    this.createSwitch(toggleHandler);
  }

  set switcher(val) {
    this.switch.checked = val;
  }

  createBurgerMenu(menuHandler) {
    this.burgerContainer = create('div', 'burger', null, this.headerContainer);
    create('div', 'bar1', null, this.burgerContainer);
    create('div', 'bar2', null, this.burgerContainer);
    create('div', 'bar3', null, this.burgerContainer);

    if (menuHandler) {
      this.burgerContainer.addEventListener('click', menuHandler);
      this.burgerContainer.addEventListener('click', () => this.burgerContainer.classList.toggle('burger__active'));
    }
  }

  createName() {
    const h1 = create('h1', 'header-caption', null, this.headerContainer);
    h1.textContent = 'english for kids';
  }

  createSwitch(toggleHandler) {
    this.switch = create('input', '', null, this.headerContainer, ['type', 'checkbox'], ['id', 'lol-checkbox']);
    this.button = create('label', '', null, this.headerContainer, ['for', 'lol-checkbox'], ['id', 'button']);
    create('div', '', null, this.button, ['id', 'knob']);
    const play = create('div', '', null, this.button, ['id', 'play']);
    play.textContent = 'Play';
    const train = create('div', '', null, this.button, ['id', 'train']);
    train.textContent = 'Train';

    this.switch.addEventListener('change', (e) => toggleHandler(e.target.checked + 1));
  }
}
