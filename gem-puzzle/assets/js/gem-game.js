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

        this.pageLayout.optionButtons['new'].addEventListener('click', () => this.newGame());
    }

    newGame () {
        this.board.newGame();
    }
}