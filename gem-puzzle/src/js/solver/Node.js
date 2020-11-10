export default class Node {
  /**
   *
   * @param {Number} score: represents f(s)
   * @param {2dimensionArray} state: represents board state
   * @param {Number} emptyRow: represents row number with empty cell
   * @param {Number} emptyCol: represents column number with empty cell
   * @param {Number} moves: count of moves from start of decision
   */
  constructor(score, state, emptyRow, emptyCol, moves) {
    this.value = score;
    this.state = state;
    this.emptyRow = emptyRow;
    this.emptyCol = emptyCol;
    this.moves = moves;
    this.size = this.state.length;
    this.hash = this.toString();
    this.path = ''; // represents a moves string[D,L,R,U]
  }

  getCost(fromNeighbor) {
    if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }

  toString() {
    let str = '';
    this.state.forEach((innerArr) => { innerArr.forEach((el) => { str = `${str},${el}`; }); });
    return str.slice(1);
  }

  getClonedState() {
    return JSON.parse(JSON.stringify(this.state));
  }
}
