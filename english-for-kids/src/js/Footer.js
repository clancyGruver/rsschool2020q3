import create from './utils/create';

export default class Footer{
    constructor() {
        this.footer = create('footer', 'footer');
        this.footerContainer = create('div', 'container', null, this.footer);
        this.ul = create('ul', 'links', null, this.footerContainer);
        this.createGitHub();
        this.createYear();
        this.createRSS();
    }

    createGitHub() {
        const li = create('li', 'link', null, this.ul);
        const a = create('a', '', null, li, ['href', 'https://github.com/clancyGruver']);
        create('img', 'github-img', null, li, ['src', './assets/img/iconmonstr-github-1.svg'], ['alt', 'github']);
    }

    createYear() {
        const li = create('li', 'link', null, this.ul);
        const strong = create('strong', '', null, li);
        strong.textContent = '2020';
    }

    createRSS() {
        const li = create('li', 'link', null, this.ul);
        const a = create('a', '', null, li, ['href', 'https://rs.school/js/']);
        create('img', 'rss-img', null, li, ['src', './assets/img/rs_school_js.svg'], ['alt', 'rs school']);
    }
}