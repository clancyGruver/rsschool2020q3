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
        const tr = create('tr', '', null, this.tbody);
        const categoryTd = create('td', '', null, tr);
        categoryTd.textContent = category;
        const wordTd = categoryTd.cloneNode(true);
        wordTd.textContent = word.word;
        tr.appendChild(wordTd);
        const translationTd = categoryTd.cloneNode(true);
        translationTd.textContent = word.translation;
        tr.appendChild(translationTd);
      });
    });
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
