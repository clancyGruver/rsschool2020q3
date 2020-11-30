export default class Router {
  routes = [];

  mode = 'history';

  root = '/';

  constructor(root = null) {
    if (root) { this.root = root; }
  }

  init() {
    document.body.addEventListener('click', (event) => {
      const el = event.target;
      if (el.dataset.route) {
        el.preventDefault();
        this.navigate(el.dataset.route);
      }
    });
  }

  add(path, handler) {
    if (!path || !handler) { throw new Error('path and handler are required!'); }
    if (typeof path !== 'string') { throw new Error('path must be string!'); }
    if (typeof handler !== 'function') { throw new Error('handler must be function!'); }
    this.routes.forEach((el) => {
      if (el.path === path) { throw new Error(`duplicate entry for ${path}!`); }
    });
    this.routes.push({
      path,
      handler,
    });
  }

  remove(path) {
    const idx = this.routes.findIndex((el) => el.path === path);
    this.routes.splice(idx, 1);
  }

  static clearSlashes(path) {
    path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  }

  getFragment() {
    let fragment = '';
    fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
    fragment = fragment.replace(/\?(.*)$/, '');
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    return this.clearSlashes(fragment);
  }

  navigate(path = '') {
    window.history.pushState(null, null, this.root + this.clearSlashes(path));
  }
}
