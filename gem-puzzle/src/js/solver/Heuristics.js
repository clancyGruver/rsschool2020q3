export default class Heuristics {
  static getManhattanDistance(currentState, distinctState) {
    let result = 0;
    currentState.forEach((row, rowIndex) => {
      row.forEach((element, colIndex) => {
        const elementPosition = { x: rowIndex, y: colIndex };
        const distPosition = Heuristics.getGoalPosition(element, distinctState);
        result += Heuristics.manhattan(elementPosition, distPosition);
      });
    });
    return result;
  }

  static getGoalPosition(val, state) {
    let goalPosition;
    const size = state.length;
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let colIndex = 0; colIndex < size; colIndex++) {
        if (state[rowIndex][colIndex] === val) {
          goalPosition = { x: rowIndex, y: colIndex };
          return goalPosition;
        }
      }
    }
    return false;
  }

  static manhattan(pos0, pos1) {
    const d1 = Math.abs(pos0.x - pos1.x);
    const d2 = Math.abs(pos0.y - pos1.y);
    return d1 + d2;
  }

  static linearConflict(state) {
    let result = 0;
    const size = state.length;
    const solved = Heuristics.getSolvedArrays(size);
    for (let ColRowIterator = 0; ColRowIterator < size; ColRowIterator++) {
      const rowState = [...state[ColRowIterator]];
      const colState = Heuristics.getColCandidate(state, ColRowIterator);
      result += Heuristics.countConflicts(rowState, solved.rows[ColRowIterator], size);
      result += Heuristics.countConflicts(colState, solved.cols[ColRowIterator], size);
    }
    return result;
  }

  static getSolvedArrays(size) {
    const result = {
      rows: [],
      cols: [],
    };
    for (let mainIdx = 0; mainIdx < size; mainIdx++) {
      result.rows[mainIdx] = [...Array(size).keys()].map((num) => mainIdx * size + num + 1);
      result.cols[mainIdx] = [...Array(size).keys()].map((num) => mainIdx + 1 + num * size);
      if (mainIdx === size - 1) {
        result.rows[mainIdx][size - 1] = 'icon';
        result.cols[mainIdx][size - 1] = 'icon';
      }
    }
    return result;
  }

  static getColCandidate(state, idx) {
    return [...Array(state.size).keys()].map((rowIterator) => state[rowIterator][idx]);
  }

  static countConflicts(candidateRow, solvedRow, size) {
    let result = 0;
    for (let outerPos = 0; outerPos < size; outerPos++) {
      const outerVal = candidateRow[outerPos];
      if (solvedRow.includes(outerVal)) {
        for (let innerPos = outerPos + 1; innerPos < size; innerPos++) {
          const innerVal = candidateRow[innerPos];
          if (solvedRow.includes(innerVal)) {
            const outerFinalPos = solvedRow.indexOf(outerVal);
            const innerFinalPos = solvedRow.indexOf(innerVal);
            const isOuterValGreater = outerVal > innerVal;
            const isOuterCandidatePosLesser = outerPos < innerPos;
            const isOuterFinalPosGreater = outerFinalPos > innerFinalPos;
            if (isOuterValGreater && isOuterCandidatePosLesser && isOuterFinalPosGreater) {
              result += 2;
            }
          }
        }
      }
    }
    return result;
  }

  /*

  static countConflicts2(candidateRow, solvedRow, size, ans = 0) {
    let result = ans;
    const counts = [...Array(size)].map(() => 0);
    candidateRow.forEach((valueOuter, idxOuter) => {
      if (solvedRow.includes(valueOuter) && valueOuter !== 'icon') {
        candidateRow.forEach((valueInner, idxInner) => {
          if (solvedRow.includes(valueInner) && valueInner !== 'icon') {
            if (valueInner !== valueOuter) {
              const isLeftVal = solvedRow.indexOf(valueInner) > solvedRow.indexOf(valueOuter);
              const isLeftIdx = idxInner < idxOuter;

              const isRightVal = solvedRow.indexOf(valueInner) < solvedRow.indexOf(valueOuter);
              const isRightIdx = idxInner > idxOuter;

              const isLeftPosition = isLeftVal && isLeftIdx;
              const isRightPosition = isRightVal && isRightIdx;

              if (isLeftPosition || isRightPosition) {
                counts[idxInner] += 1;
              }
            }
          }
        });
      }
    });
    const maxCount = Math.max(...counts);
    if (maxCount === 0) {
      result *= 2;
    } else {
      const i = counts.indexOf(maxCount);
      candidateRow[i] = -1;
      result += 1;
      return Heuristics.countConflicts(candidateRow, solvedRow, size, result);
    }
    return result;
  }
*/
  static lastMove(state) {
    return 0;
  }
}
