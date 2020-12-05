import create from '../utils/createHTMLElement';

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
}
