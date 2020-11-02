import PageLayout from './PageLayout.js';
import Board from './Board.js';

export default class GemGame{
    /**
     * 
     * @param {int} boardSize 
     */
    constructor (boardSize) {
        const defaultBoardSize = 4;
        let size = parseInt(boardSize) || defaultBoardSize;
        if(size < 3) size = 3;
        if(size > 8) size = 8;
        this.boardSize = size;
    }

    init () {
        this.pageLayout = new PageLayout(this.boardSize);
        this.pageLayout.init();

        this.board = new Board(this.boardSize);
        this.board.init();

        this.pageLayout.mainContent.appendChild(this.board.board);

        //menu handlers
        this.pageLayout.optionButtons['new'].addEventListener('click', () => this.newGame() );

        this.movableElements();
    }

    newGame () {
        this.board.newGame();
    }

    move (e) {
        const {row, cell} = e.target.dataset;
        console.log(e.target.dataset);
        this.board.move(row, cell);
        this.movableElements();
    }

    movableElements () {
        this.movable = document.querySelectorAll('.board__cell--active');
        Array.from(this.movable).forEach( el => el.addEventListener('click', (e) => this.move(e) ) );
    }
}