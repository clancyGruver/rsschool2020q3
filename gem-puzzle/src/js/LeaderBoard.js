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
    const score = create('div', 'record__table--cell', null, headerContainer);
    const time = create('div', 'record__table--cell', null, headerContainer);
    const moves = create('div', 'record__table--cell', null, headerContainer);
    score.textContent = 'очки';
    time.textContent = 'время';
    moves.textContent = 'ходов';
  }

  createBody() {
    this.body = create('div', 'record__table--list', null, this.tableContainer);
  }

  createRow(resultRow) {
    const score = create('div', 'record__table--cell');
    score.textContent = resultRow.score;

    const time = create('div', 'record__table--cell');
    time.textContent = resultRow.time;

    const moves = create('div', 'record__table--cell');
    moves.textContent = resultRow.moves;

    create('div', 'record__table--row', [score, time, moves], this.body);
  }

  /**
     * @param {array} resultsArray
     */
  setResults(resultsArray) {
    if (!Array.isArray(resultsArray)) return false;
    resultsArray.forEach((resultsRow) => {
      if (resultsRow !== null) this.createRow(resultsRow);
    });
    return true;
  }

  getTable() {
    return this.main;
  }

  clearBoard() {
    this.body.innerHTML = '';
  }
}
