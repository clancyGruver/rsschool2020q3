import create from '../utils/createHTMLElement';
import * as Storage from '../utils/storage';

export default class Statistic {
  constructor() {
    this.orders = ['asc', 'desc'];
    this.name = 'statistic page';
    this.sortIcons = {
      none: '<i class="fas fa-sort sort"></i>',
      asc: '<i class="fas fa-sort-down sort"></i>',
      desc: '<i class="fas fa-sort-up sort"></i>',
    };
  }

  init(vocabulary, navigate) {
    this.navigate = navigate;
    this.vocabulary = vocabulary;
    this.createButtons();
    this.createTable();
    this.createTableHeaders();
    this.fillTableWithData();
  }

  get content() {
    return [
      this.buttonsContainer,
      this.tableContainer,
    ];
  }

  createTable() {
    this.tableContainer = create('div', 'statistic-table-container');
    this.table = create('table', 'statistic-table', null, this.tableContainer);
    this.trs = [];
  }

  createButtons() {
    const buttonNames = [
      {
        name: 'Repeat difficult words',
        class: 'btn-yellow',
        handler: () => this.repeatHardWords(),
      },
      {
        name: 'Reset',
        class: 'btn-red',
        handler: () => this.resetStatistic(),
      },
    ];
    this.buttonsContainer = create('div', 'controls');
    buttonNames.forEach((btn) => {
      this.buttonsContainer.appendChild(Statistic.createButton(btn));
    });
  }

  createTableHeaders() {
    this.thead = [];
    const headers = [
      'Category',
      'Word',
      'Translation',
      '<i class="fas fa-brain"></i>',
      '<i class="fas fa-check-circle"></i>',
      '<i class="fas fa-times-circle"></i>',
      '<i class="fas fa-percent"></i>',
    ];
    const header = create('thead', 'statistic-table-header', null, this.table);
    const row = create('tr', '', null, header);
    headers.forEach((headerCaption, headerIndex) => {
      const th = create('th', '', null, row, ['order', 'none']);
      this.thead.push(th);
      th.innerHTML = headerCaption + this.sortIcons.none;
      th.addEventListener('click', (e) => {
        const el = e.target.closest('th');
        if (!el) return;
        let { order } = el.dataset;
        this.clearAllTh();
        if (this.orders.includes(order)) {
          if (order === 'asc') {
            order = 'asc';
            el.dataset.order = 'desc';
          } else {
            order = 'desc';
            el.dataset.order = 'asc';
          }
        } else {
          order = 'desc';
          el.dataset.order = 'asc';
        }
        const childrenCount = el.children.length;
        el.children[childrenCount - 1].remove();
        el.innerHTML += this.sortIcons[order];
        this.sortTable(headerIndex, order);
      });
    });
  }

  clearAllTh() {
    this.thead.forEach((th) => {
      const childrenCount = th.children.length;
      const curTh = th;
      curTh.children[childrenCount - 1].remove();
      curTh.innerHTML += this.sortIcons.none;
      curTh.dataset.order = 'none';
    });
  }

  fillTableWithData() {
    if (this.tbody) {
      this.tbody.innerHTML = '';
    } else {
      this.tbody = create('tbody', '', null, this.table);
    }

    this.trs.length = 0;

    const categories = Object.keys(this.vocabulary);
    categories.forEach((category) => {
      this.vocabulary[category].forEach((word) => {
        const wordStatistic = Statistic.getWordStatistic(word.word);
        const wordFlow = ['word', 'translation'];
        const wordStatisticFlow = ['trainClick', 'correctAnswers', 'wrongAnswers', 'rightPercent'];
        const tr = create('tr', '');
        this.trs.push(tr);

        tr.appendChild(Statistic.createTd(category));
        wordFlow.forEach((wordEl) => {
          tr.appendChild(Statistic.createTd(word[wordEl]));
        });
        wordStatisticFlow.forEach((el) => {
          tr.appendChild(Statistic.createTd(wordStatistic[el]));
        });
      });
    });
    this.renderTableBody();
  }

  resetStatistic() {
    localStorage.clear();
    this.fillTableWithData();
    this.clearAllTh();
  }

  repeatHardWords() {
    if (!this.vocabulary.repeat) {
      this.vocabulary.repeat = [];
    } else {
      this.vocabulary.repeat.length = 0;
    }

    const storageLength = localStorage.length;
    let wordsForRepeatCount = 0;
    for (let i = 0; i < storageLength; i += 1) {
      const storageKey = localStorage.key(i);
      const wordStat = Statistic.getWordStatistic(storageKey);
      const isHardWord = wordStat.correctAnswers < wordStat.wrongAnswers;
      if (isHardWord) {
        this.vocabulary.repeat.push(this.findWordInVocabulary(storageKey));
        wordsForRepeatCount += 1;
        if (wordsForRepeatCount === 7) break;
      }
    }
    const routeParams = {
      name: 'repeat',
      path: 'category',
      params: {
        categoryName: 'repeat',
      },
    };
    this.navigate(routeParams);
  }

  findWordInVocabulary(word) {
    const categories = Object.keys(this.vocabulary).filter((cat) => cat !== 'repeat');
    for (let i = 0; i < categories.length; i += 1) {
      const category = categories[i];
      const res = this.vocabulary[category].find((wordObj) => wordObj.word === word);
      if (res) return res;
    }
    return false;
  }

  sortTable(index, order) {
    const ascSort = (a, b) => {
      const aVal = a.children[index].textContent;
      const bVal = b.children[index].textContent;
      let res = 0;
      if (Number.isFinite(parseFloat(aVal))) {
        res = aVal - bVal;
      } else {
        res = aVal.toLowerCase() > bVal.toLowerCase() ? 1 : -1;
      }
      return res;
    };
    const descSort = (a, b) => {
      const aVal = a.children[index].textContent;
      const bVal = b.children[index].textContent;
      let res = 0;
      if (Number.isFinite(parseFloat(aVal))) {
        res = bVal - aVal;
      } else {
        res = aVal.toLowerCase() < bVal.toLowerCase() ? 1 : -1;
      }
      return res;
    };
    const orders = {
      asc: ascSort,
      desc: descSort,
    };
    this.trs.sort(orders[order]);
    this.renderTableBody();
  }

  renderTableBody() {
    this.tbody.innerHTML = '';
    this.trs.forEach((tr) => this.tbody.appendChild(tr));
  }

  static createTd(content) {
    const td = create('td', '');
    td.textContent = content;
    return td;
  }

  static getWordStatistic(word) {
    if (Storage.check(word)) {
      const statistic = Storage.get(word);
      const totalAnswers = statistic.correctAnswers + statistic.wrongAnswers;
      const percent = Math.round((statistic.correctAnswers / totalAnswers) * 100);
      statistic.rightPercent = Number.isFinite(percent) ? percent : 0;
      return statistic;
    }
    return {
      trainClick: 0,
      wrongAnswers: 0,
      correctAnswers: 0,
      rightPercent: 0,
    };
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

  static createButton(props) {
    const btn = create('button', `btn ${props.class}`, null, null, ['type', 'button']);
    btn.textContent = props.name;
    btn.addEventListener('click', props.handler);
    return btn;
  }
}
