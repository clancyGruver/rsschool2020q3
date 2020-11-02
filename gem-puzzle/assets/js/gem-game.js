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
        this.startTimer();
    }

    newGame () {
        this.board.newGame();
        this.startTimer();
    }

    move (e) {
        const {row, cell} = e.target.dataset;
        this.board.move(row, cell);
        this.movableElements();
        this.pageLayout.increaseMoves();
    }

    movableElements () {
        this.movable = document.querySelectorAll('.board__cell--active');
        Array.from(this.movable).forEach( el => el.addEventListener('click', (e) => this.move(e) ) );
    }

    startTimer (){
        this.timer = 0;
        this.timerClick();
    }

    timerClick () {
        this.pageLayout.setTime(this.timer++);
        setTimeout(() => {
            this.timerClick();
        }, 1000);
    }
}