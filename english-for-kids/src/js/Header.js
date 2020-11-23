import create from './utils/create';

export default class Header{
    constructor() {
        this.header = create('header', 'header');
        this.headerContainer = create('div', 'container', null, this.header);
        this.createBurgerMenu();
        this.createName();
        this.createSwitch();
    }

    createBurgerMenu() {
        const burgerContainer = create('div', 'burger', null, this.headerContainer);
        create('div', 'bar1', null, burgerContainer);
        create('div', 'bar2', null, burgerContainer);
        create('div', 'bar3', null, burgerContainer);
    }

    createName() {
        const h1 = create('h1', '', null, this.headerContainer);
        h1.textContent = 'english for kids';
    }

    createSwitch() {
        this.switch = create('input', '', null, this.headerContainer, ['type', 'checkbox'], ['id', 'lol-checkbox']);
        this.button = create('label', '', null, this.headerContainer, ['for', 'lol-checkbox'], ['id', 'button']);
        const knob = ('div', '', null, this.button, ['id', 'knob']);
        const play = ('div', '', null, this.button, ['id', 'play']);
        play.textContent = 'Play';
        const train = ('div', '', null, this.button, ['id', 'train']);
        train.textContent = 'Train';
    }
}