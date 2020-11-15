import Node from './Node';
import Heuristics from './Heuristics';
import PriorityQueue from './PriorityQueue';

export default class AStar {
  /**
   * @param {*} initial
   * @param {*} goal
   * @param {*} empty
   */
  constructor(initialState, goalState, empty) {
    if (initialState.state) {
      this.initial = initialState;
    } else {
      const InitialIdxs = AStar.findEmptyColRow(initialState, empty);
      this.initial = new Node(0, initialState, InitialIdxs.row, InitialIdxs.col, 0);
    }
    if (goalState.state) {
      this.goal = goalState;
    } else {
      const goalIdxs = AStar.findEmptyColRow(goalState, empty);
      this.goal = new Node(0, goalState, goalIdxs.row, goalIdxs.col, 0);
    }
    this.empty = empty;
    this.queue = new PriorityQueue();
    this.queue.enqueue(this.initial);
    this.visited = new Set(); // closed list
  }

  static findEmptyColRow(state, emptySign) {
    const idxs = {
      col: -1,
      row: -1,
    };
    state.forEach((row, rowIdx) => {
      row.forEach((element, colIdx) => {
        if (element === emptySign) {
          idxs.col = colIdx;
          idxs.row = rowIdx;
        }
      });
    });
    return idxs;
  }

  execute() {
    this.visited.add(this.initial.hash);
    while (this.queue.size() > 0) {
      const current = this.queue.dequeue();

      if (current.hash === this.goal.hash) {
        return current;
      }
      this.expand(current);
    }

    return false;
  }

  expand(node) {
    const { emptyCol, emptyRow, size } = node;

    const allowedMoves = AStar.validMoves(emptyCol, emptyRow, size);
    const lastMoves = node.path.split('');
    const lastMove = lastMoves[lastMoves.length - 1];
    if(lastMove) {
      allowedMoves.filter((el) => !AStar.oppositeMoves(el, lastMove));
    }

    allowedMoves.forEach((directionSign) => {
      const newState = node.getClonedState();
      let newStateRow = emptyRow;
      if (directionSign === 'U' || directionSign === 'D') {
        newStateRow = directionSign === 'U' ? emptyRow - 1 : emptyRow + 1;
      }
      let newStateCol = emptyCol;
      if (directionSign === 'L' || directionSign === 'R') {
        newStateCol = directionSign === 'L' ? emptyCol - 1 : emptyCol + 1;
      }

      const temp = newState[newStateRow][newStateCol];
      newState[newStateRow][newStateCol] = this.empty;
      newState[emptyRow][emptyCol] = temp;
      const newNode = new Node(0, newState, newStateRow, newStateCol, node.moves + 1);

      if (!this.visited.has(newNode.hash)) {
        newNode.value = newNode.moves + this.heuristic(newNode);
        newNode.path = `${node.path}${directionSign}`;
        this.queue.enqueue(newNode);
        this.visited.add(newNode.hash);
      }

      return true;
    });
  }

  heuristic(node) {
    const manhattan = Heuristics.getManhattanDistance(node.state, this.goal.state);
    const linearConflict = Heuristics.linearConflict(node.state);
    return manhattan + linearConflict;
  }

  static validMoves(col, row, size) {
    const validMoves = [];
    if (col !== 0) {
      validMoves.push('L');
    }
    if (col < size - 1) {
      validMoves.push('R');
    }
    if (row !== 0) {
      validMoves.push('U');
    }
    if (row < size - 1) {
      validMoves.push('D');
    }
    return validMoves;
  }

  static oppositeMoves(cur, last) {
    let res = false;

    if (cur === 'L' && last === 'R') res = true;
    if (cur === 'R' && last === 'L') res = true;
    if (cur === 'U' && last === 'D') res = true;
    if (cur === 'D' && last === 'U') res = true;

    return res;
  }
}
