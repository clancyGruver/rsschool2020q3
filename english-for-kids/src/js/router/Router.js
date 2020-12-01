export default class Router {
  constructor(root = null, mainHandler) {
    this.routes = [];
    this.mode = 'history';
    this.mainHandler = mainHandler;
    if (root) {
      this.root = root;
    } else {
      this.root = '/';
    }
  }

  listen() {
    document.body.addEventListener('click', (event) => {
      const el = event.target.closest('[data-route]');
      if (!el) return;
      console.log(el);
      const routeParams = JSON.parse(el.dataset.route);
      this.navigate(routeParams.path, routeParams);
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

  static queryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const result = [];
    const urlKeys = Array.from(urlParams.keys());
    for (let i = 0; i < urlKeys.length; i += 1) {
      const currentUrlKey = urlKeys[i];
      result.push({
        name: currentUrlKey,
        value: urlParams.get(currentUrlKey),
      });
    }
    return result;
  }

  navigate(path = '/', params = {}) {
    const route = this.routes.find((el) => el.path === path);
    const queryParams = Router.queryParams();
    this.Page = route.handler;
    this.pageParams = params;
    console.log(route, params, path);
    window.history.pushState(null, null, this.root + path);
    this.mainHandler(params);
  }
}
