export default class PriorityQueue {
  constructor() {
    this.items = [];
  }

  swap(idx1, idx2) {
    [this.items[idx1], this.items[idx2]] = [this.items[idx2], this.items[idx1]];
  }

  bubbleUp() {
    let idx = this.size() - 1;
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.items[parentIdx].value > this.items[idx].value) {
        this.swap(parentIdx, idx);
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  bubbleDown() {
    let parentIdx = 0;
    const size = this.size();
    const elementPriority = this.items[0].value;
    let isSwap = true;

    while (isSwap) {
      const leftChildIdx = (2 * parentIdx) + 1;
      const rightChildIdx = (2 * parentIdx) + 2;
      let LCP; // left child priority
      let RCP; // right child priority
      let indexToSwap = null;

      if (leftChildIdx < size) {
        LCP = this.items[leftChildIdx].value;
        if (LCP < elementPriority) {
          indexToSwap = leftChildIdx;
        }
      }

      if (rightChildIdx < size) {
        RCP = this.items[rightChildIdx].value;

        const rightChildGreaterWithSwap = RCP < elementPriority && indexToSwap === null;
        const rightChildGreaterWithNoSwap = RCP < LCP && indexToSwap !== null;
        if (rightChildGreaterWithSwap || rightChildGreaterWithNoSwap) {
          indexToSwap = rightChildIdx;
        }
      }

      if (indexToSwap === null) {
        isSwap = false;
      } else {
        this.swap(parentIdx, indexToSwap);
        parentIdx = indexToSwap;
      }
    }
  }

  enqueue(element) {
    this.items.push(element);
    this.bubbleUp();
  }

  dequeue() {
    this.swap(0, this.size() - 1);
    const poppedNode = this.items.pop();
    if (this.items.length > 1) {
      this.bubbleDown();
    }

    return poppedNode;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toString() {
    let res = '';
    this.items.forEach((el) => { res = `${res}, ${el}`; });
  }
}
