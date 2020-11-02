import create from './utils/create.js';

export default class PageLayout{
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.optionButtons = {};
    }
    init() {
        document.body.prepend(
            this.createHeader(),
            this.createMainContent(),
            this.createFooter()
        );
    }

    createHeader () {
        const statistics = this.createStatistics();

        const options = this.createOptions();

        const headerCaption = create('h1','header__caption');
        headerCaption.textContent = 'gem puzzle';

        const headerContainer = create('div','header__container', [headerCaption, options, statistics]);
        const header = create('header','header', headerContainer);

        return header;
    }

    createMainContent () {
        const container = create('div', 'container')
        const main = create('main', 'main', container);
        this.mainContent = container;

        return main;
    }

    createFooter () {
        const listItems = [];
        for(let i = 3; i < 9; i++){
            const btnOptions = [
                ['type', 'button'],
                ['size', i]
            ];
            const btn = create('button', 'field__list--btn', null, null, ...btnOptions); 
            btn.textContent = `${i} X ${i}`;
            const li = create('li', 'field__list--element', btn);
            listItems.push(li);
        }
        const fieldList = create('div', 'field__list', listItems);
        const footerContainer = create('div', 'footer__container', fieldList);
        const footer = create('footer', 'footer', footerContainer);

        return footer;
    }

    createOptions () {
        const optionPositions = ['new', 'pause', 'save', 'load', 'records'];
        const optionListElements = optionPositions.map( name => {
            const btnParams = [['type', 'button'],['id', name]];
            const btn = create('button', 'field__list--btn', null, null, ...btnParams);
            btn.textContent = name;
            this.optionButtons[name] = btn;
            const li = create('li', 'field__list--element', btn);
            return li;
        });
        const optionsList = create('ul','field__list', optionListElements);
        const options = create('div','options', optionsList);
        return options;
    }

    createStatistics () {
        const moves = this.createMoves();
        const timer = this.createTimer();

        const rightSide = create('div','statistics__right-side', [moves, timer]);

        const fieldSize = create('h2', 'field-size');
        fieldSize.textContent = `${this.boardSize} X ${this.boardSize}`;
        this.statisticsFieldSize = fieldSize;
        const leftSide = create('div','statistics__left-side', fieldSize);

        const statistics = create('div','statistics', [leftSide, rightSide]);

        return statistics;
    }

    createMoves () {
        const movesText = create('span', 'moves__text');
        movesText.textContent = 'moves';
        const movesCount = create('span', 'moves__move-count');
        movesCount.textContent = '00';
        this.movesCount = movesCount;
        const moves = create('div', 'moves', [movesText, movesCount]);

        return moves;
    }

    createTimer () {
        const timeText = create('span', 'time__text');
        timeText.textContent = 'time ';

        const minutes = create('span', 'time__timer--minutes');
        minutes.textContent = '00';
        this.minutesContainer = minutes;
        const seconds = create('span', 'time__timer--seconds');
        seconds.textContent = '00';
        this.secondsContainer = seconds;
        const colon = create('span', 'time__timer--colon');
        colon.textContent = ':';
        const timeTimer = create('div', 'time__timer', [minutes, colon, seconds]);

        const timer = create('div', 'time', [timeText, timeTimer]);

        return timer;
    }

}