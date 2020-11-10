export default class PriorityQueue {
  constructor(comparator) {
    this.items = [];
    this.comparator = comparator;
  }

  enqueue(element) {
    let contain = false;
    for (let i = 0; i < this.size(); i++) {
      if (this.comparator(this.items[i], element)) {
        this.items.splice(i, 0, element);
        contain = true;
        break;
      }
    }
    if (!contain) {
      this.items.push(element);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items.shift();
  }

  top() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items[0];
  }

  last() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items[this.size() - 1];
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
