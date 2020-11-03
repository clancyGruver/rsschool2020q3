import create from './utils/create.js';

export default class Modal {
    constructor () {
        this.header = null;
        this.modalText = null;
        this.modal = null;
    }

    init () {
        this.modal = create('div', 'modal');
        const modalWindows = create('div', 'modal__window', null, this.modal);
        this.modalContainer = create('div', 'modal__window--container', null, modalWindows);

        this.createHeader();
        this.createBody();
        this.createFooter();
    }

    /**
     * @param {string} header
     * @param {string} modalText
     * @param {function} okHandler
     * @param {function} abortHandler
     */
    confirm (header, modalText, okHandler = null, abortHandler = null ) {
        this.header.textContent = header;
        this.body.textContent = modalText;
        this.modalContainer.appendChild(this.footer);
        document.body.appendChild(this.modal);
        this.confirmBtn.addEventListener('click', () => {
            this.close(); 
            if (typeof okHandler === 'function') okHandler();
        });
        this.dismissBtn.addEventListener('click', () => {
            this.close();
            if (typeof abortHandler === 'function') abortHandler();
        });
    }

    show (header, modalText) {
        this.header.textContent = header;
        this.body.textContent = modalText;
        this.modalContainer.removeChild(this.footer);
        document.body.appendChild(this.modal);
    }

    createHeader () {
        const headerContainer = create('div', 'modal__window__header', null, this.modalContainer);
        this.header = create('h3', 'modal__window__header--caption', null, headerContainer);
        const close = create('span', 'modal__window__header--close', null, headerContainer);
        close.innerHTML = '&times';
        close.addEventListener('click', () => this.close() );
    }

    createBody () {
        const bodyContainer = create('div', 'modal__window__body', null, this.modalContainer);
        this.body = create('p', 'modal__window__body--content', null, bodyContainer);
    }

    createFooter () {
        this.footer = create('div', 'modal__window__footer');
        this.confirmBtn = create('button', 'modal__window__footer__btn confirm', null, this.footer, ['type', 'button']);
        this.confirmBtn.textContent = 'V';
        this.dismissBtn = create('button', 'modal__window__footer__btn dismiss', null, this.footer, ['type', 'button']);
        this.dismissBtn.textContent = 'X';
    }

    close () {
        document.body.removeChild(this.modal);
    }
}