import create from './utils/create';

export default class MainContent{
    constructor() {
        this.main = create('main', 'main');
        this.mainContainer = create('div', 'container', null, this.main);
    }
}