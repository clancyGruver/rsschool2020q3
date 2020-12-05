import create from '../utils/createHTMLElement';
import * as Storage from '../utils/storage';

export default class Statistic {
  constructor() {
    this.name = 'statistic page';
  }

  init(vocabulary) {
    this.vocabulary = vocabulary;
    this.createTable();
    this.createTableHeaders();
    this.fillTableWithData();
  }

  get content() {
    return [
      this.table,
    ];
  }

  createTable() {
    this.table = create('table', 'statistic-table');
  }

  createTableHeaders() {
    const headers = [
      'Category',
      'Word',
      'Translation',
      'Trained',
      'Correct',
      'Wrong',
      'Percent',
    ];
    const header = create('thead', 'statistic-table-header', null, this.table);
    const row = create('tr', '', null, header);
    headers.forEach((headerCaption) => {
      const th = create('th', '', null, row);
      th.textContent = headerCaption;
    });
  }

  fillTableWithData() {
    this.tbody = create('tbody', '', null, this.table);
    const categories = Object.keys(this.vocabulary);
    categories.forEach((category) => {
      this.vocabulary[category].forEach((word) => {
        const wordStatistic = Statistic.getWordStatistic(word.word);
        const wordFlow = ['word', 'translation'];
        const wordStatisticFlow = ['trainClick', 'correctAnswers', 'wrongAnswers', 'rightPercent'];
        const tr = create('tr', '', null, this.tbody);

        if (category === 'Food') {
          console.log(word, wordStatistic);
        }

        tr.appendChild(Statistic.createTd(category));
        wordFlow.forEach((wordEl) => {
          tr.appendChild(Statistic.createTd(word[wordEl]));
        });
        wordStatisticFlow.forEach((el) => {
          tr.appendChild(Statistic.createTd(wordStatistic[el]));
        });
      });
    });
  }

  static createTd(content) {
    const td = create('td', '');
    td.textContent = content;
    return td;
  }

  static getWordStatistic(word) {
    if (Storage.check(word)) {
      const statistic = Storage.get(word);
      const percent = (statistic.correctAnswers / statistic.wrongAnswers).toFixed(2) * 100;
      statistic.rightPercent = Number.isFinite(percent) ? percent : 0;
      return statistic;
    }
    return {
      trainClick: 0,
      wrongAnswers: 0,
      correctAnswers: 0,
      rightPercent: 0,
    };
  }

  static trainClick(word) {
    let wordObject = {
      trainClick: 1,
      wrongAnswers: 0,
      correctAnswers: 0,
    };
    if (Storage.check(word)) {
      wordObject = Storage.get(word);
      wordObject.trainClick = parseInt(wordObject.trainClick, 10) + 1;
    }
    Storage.set(word, wordObject);
  }

  static correctAnswerClick(word) {
    let wordObject = {
      trainClick: 0,
      wrongAnswers: 0,
      correctAnswers: 1,
    };
    if (Storage.check(word)) {
      wordObject = Storage.get(word);
      wordObject.correctAnswers = parseInt(wordObject.correctAnswers, 10) + 1;
    }
    Storage.set(word, wordObject);
  }

  static wrongAnswerClick(word) {
    let wordObject = {
      trainClick: 0,
      wrongAnswers: 1,
      correctAnswers: 0,
    };
    if (Storage.check(word)) {
      wordObject = Storage.get(word);
      wordObject.wrongAnswers = parseInt(wordObject.wrongAnswers, 10) + 1;
    }
    Storage.set(word, wordObject);
  }
}
