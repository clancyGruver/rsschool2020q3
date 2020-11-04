import create from './utils/create';

export default class LeaderBoard {
  init() {
    this.main = create('div', 'record');
    this.tableContainer = create('div', 'record__table', null, this.main);
    this.createHeader();
    this.createBody();
  }

  createHeader() {
    const headerContainer = create('div', 'record__table--header', null, this.tableContainer);
    const time = create('div', 'record__table--cell', null, headerContainer);
    const moves = create('div', 'record__table--cell', null, headerContainer);
    time.textContent = 'время';
    moves.textContent = 'ходов';
  }

  createBody() {
    this.body = create('div', 'record__table--list', null, this.tableContainer);
  }

  createRow(...cells) {
    const row = create('div', 'record__table--row', null, this.body);

    cells.forEach((element) => {
      const cell = create('div', 'record__table--cell', null, row);
      cell.textContent = element;
    });
  }

  /**
     * @param {array} resultsArray
     */
  setResults(resultsArray) {
    if (!Array.isArray(resultsArray)) return false;
    resultsArray.forEach((resultsRow) => this.createRow(...resultsRow));
    return true;
  }

  getTable() {
    return this.main;
  }
}
