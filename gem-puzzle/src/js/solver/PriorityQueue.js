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

    while (true) {
      const leftChildIdx = (2 * parentIdx) + 1;
      const rightChildIdx = (2 * parentIdx) + 2;
      let leftChildPriority;
      let rightChildPriority;
      let indexToSwap = null;

      if (leftChildIdx < size) {
        leftChildPriority = this.items[leftChildIdx].value;
        if (leftChildPriority < elementPriority) {
          indexToSwap = leftChildIdx;
        }
      }

      if (rightChildIdx < size) {
        rightChildPriority = this.items[rightChildIdx].value;

        const rightChildGreaterWithSwap = rightChildPriority < elementPriority && indexToSwap === null;
        const rightChildGreaterWithNoSwap = rightChildPriority < leftChildPriority && indexToSwap !== null;
        if (rightChildGreaterWithSwap || rightChildGreaterWithNoSwap) {
          indexToSwap = rightChildIdx;
        }
      }

      if (indexToSwap === null) {
        break;
      }

      this.swap(parentIdx, indexToSwap);
      parentIdx = indexToSwap;
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
