import create from './utils/create';

export default class PageLayout {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.fieldSizeButtons = [];
    this.optionButtons = {};
    this.movesCount = 0;
    this.sounds = {};
  }

  init() {
    document.body.prepend(
      this.createHeader(),
      this.createMainContent(),
      this.createFooter(),
      this.createSound(),
    );
  }

  setBoardSize(boardSize = null) {
    if (boardSize) this.boardSize = boardSize;
    this.statisticsFieldSize.textContent = `${this.boardSize} X ${this.boardSize}`;
  }

  createHeader() {
    const statistics = this.createStatistics();

    const options = this.createOptions();

    const headerCaption = create('h1', 'header__caption');
    headerCaption.textContent = 'gem puzzle';

    const headerContainer = create('div', 'header__container', [headerCaption, options, statistics]);
    const header = create('header', 'header', headerContainer);

    return header;
  }

  createMainContent() {
    const container = create('div', 'container');
    const main = create('main', 'main', container);
    this.mainContent = container;

    return main;
  }

  createFooter() {
    for (let i = 3; i < 9; i++) {
      const btnOptions = [
        ['type', 'button'],
        ['size', i],
      ];
      const btn = create('button', 'field__list--btn', null, null, ...btnOptions);
      btn.textContent = `${i} X ${i}`;
      this.fieldSizeButtons[i] = create('li', 'field__list--element', btn);
    }
    const fieldList = create('div', 'field__list', this.fieldSizeButtons);
    const footerContainer = create('div', 'footer__container', fieldList);
    const footer = create('footer', 'footer', footerContainer);

    return footer;
  }

  setScore(score) {
    this.score.textContent = score;
  }

  createOptions() {
    const optionPositions = {
      new: 'replay',
      save: 'save_alt',
      load: 'publish',
      results: 'receipt',
      sound: 'music_note',
    };
    const optionListElements = Object.keys(optionPositions).map((name) => {
      const btnParams = [['type', 'button'], ['id', name]];
      const btn = create('button', 'field__list--btn', null, null, ...btnParams);
      const iconName = optionPositions[name];
      btn.appendChild(PageLayout.createIcon(iconName));
      this.optionButtons[name] = btn;
      const li = create('li', 'field__list--element', btn);
      return li;
    });
    const optionsList = create('ul', 'field__list', optionListElements);
    const options = create('div', 'options', optionsList);
    return options;
  }

  static createIcon(iconName) {
    return create('i', 'material-icons', iconName);
  }

  createStatistics() {
    const moves = this.createMoves();
    const timer = this.createTimer();
    const score = this.createScore();

    const rightSide = create('div', 'statistics__right-side', [moves, timer, score]);

    this.statisticsFieldSize = create('h2', 'field-size');
    const leftSide = create('div', 'statistics__left-side', this.statisticsFieldSize);
    this.setBoardSize();

    const statistics = create('div', 'statistics', [leftSide, rightSide]);

    return statistics;
  }

  createScore() {
    const text = create('span', 'score__text');
    text.textContent = 'score';
    this.score = create('span', 'score__value');
    const container = create('div', 'score', [text, this.score]);
    return container;
  }

  createMoves() {
    const movesText = create('span', 'moves__text');
    movesText.textContent = 'moves';
    const movesCount = create('span', 'moves__move-count');
    movesCount.textContent = '00';
    this.movesElement = movesCount;
    const moves = create('div', 'moves', [movesText, movesCount]);

    return moves;
  }

  createTimer() {
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

  getMoves() {
    return this.movesCount;
  }

  getTime() {
    return `${this.minutesContainer.textContent}:${this.secondsContainer.textContent}`;
  }

  setTime(time) {
    const { minutes, seconds } = PageLayout.createTimeFromSeconds(time);
    this.minutesContainer.textContent = minutes;
    this.secondsContainer.textContent = seconds;
  }

  static createTimeFromSeconds(secondsIn) {
    let seconds = parseInt(secondsIn, 10);
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return {
      minutes: PageLayout.addZero(minutes),
      seconds: PageLayout.addZero(seconds),
    };
  }

  static addZero(val) {
    return parseInt(val, 10) < 10 ? `0${val}` : val;
  }

  setMoves(movesCount) {
    this.movesElement.textContent = PageLayout.addZero(movesCount);
  }

  getFieldSizeButtons() {
    return this.fieldSizeButtons;
  }

  createSound() {
    const path = './assets/sounds/';
    const soundContainer = create('div', 'sound-container');
    this.sounds.move = create('audio', '', null, soundContainer, ['src', `${path}move.mp3`]);
    this.sounds.applause = create('audio', '', null, soundContainer, ['src', `${path}applause.wav`]);
    return soundContainer;
  }
}
