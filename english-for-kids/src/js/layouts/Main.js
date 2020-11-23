import create from '../utils/create';
import Card from './Card';

export default class MainPage{
    constructor() {
        this.name = 'main page';
        this.contentVal = [];
    }

    init(categories){
        this.content = categories.map( category => new Card(category));
    }

    get content() {
        return this.contentVal;
    }

    set content(val) {
        val.forEach(element => {
            this.contentVal.push(element.card);
        });
    }
}
