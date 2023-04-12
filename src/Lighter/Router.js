import { Logger } from './utils';

let routerInitiated = false;
const logger = new Logger('LIGHTER.js ROUTER *****');

class Router {
  constructor(routesData, attachId, rcCallback, componentProps) {
    // routesData = {
    //   routes: [], (= see below [Array] [required])
    //   basePath: '', (= basepath of the whole app [String] [optional], eg. '/basepath')
    //   titlePrefix: '', (= page and document title prefix [String] [optional])
    //   titleSuffix: '', (= page and document title suffix [String] [optional])
    //   langFn: function() {}, (= language strings getter function [Function] [optional])
    // } [Object] [required]
    // attachId = id of the element that the Router is attached to [String] [required]
    // rcCallback = after the route has changed callback function [Function] [required]
    // componentProps = additional component props to be added to all page components [Object] [optional]
    // *****************
    // routesData.routes = [{
    //   route: '', (= route path [String] [required])
    //   id: '', (= view's component id [String] [required if not a redirect])
    //   source: Component class reference, (= component's class [Component] [required])
    //   title: '', (= page and document title without translation [String] [optional])
    //   titleKey: '', (= page and document title translation id [requires langFn], overwrites title attribute if set [String] [optional])
    //   is404: false, (= set true if current route is 404 template [Boolean] [required for one route])
    //   beforeDraw: (routeData) => { return '/401'; }, (= function to call before the view is shown, return a new route if needed)
    // },
    // {
    //   route: '', (= route path [String] [required if redirect missing])
    //   redirect: '', (= redirect path [String] [required if route missing])
    // }]
    // *****************
    if (routerInitiated) {
      const errorMsg = 'Router has already been initiated. Only one router per app is allowed.';
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    const REQUIRED_PARAMS_MSG = 'Required params: new Route(routesData, attachId, rcCallback);';
    if (!routesData || !routesData.routes || !routesData.routes.length) {
      const errorMsg =
        'Missing routesData parameter, routesData.routes, or it is an empty array. ' +
        REQUIRED_PARAMS_MSG;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (!attachId) {
      const errorMsg = 'Missing attachId parameter. ' + REQUIRED_PARAMS_MSG;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (!rcCallback) {
      const errorMsg =
        'Missing rcCallback (route change callback) parameter / function. ' + REQUIRED_PARAMS_MSG;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    let fourOFourFound = false;
    for (let i = 0; i < routesData.routes.length; i++) {
      if (routesData.routes[i].is404) fourOFourFound = true;
      if (!routesData.routes[i].id && !routesData.routes[i].redirect) {
        // @TODO: Create an UUID if missing
        const errorMsg = `Route is missing the 'id' property.`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      if (!routesData.routes[i].route) {
        const errorMsg = `Route '${routesData.routes[i].id}' is missing the 'route' property.`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      if (!routesData.routes[i].source && !routesData.routes[i].redirect) {
        const errorMsg = `Route '${routesData.routes[i].id}' is missing the 'source' property.`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
    }
    if (!fourOFourFound) {
      const errorMsg = 'Could not find 404 template.';
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    RouterRef = this;
    this.routes = [];
    this.nextHistoryState = {};
    this.curHistoryState = {};
    this.basePath = routesData.basePath || '';
    this.titlePrefix = routesData.titlePrefix || '';
    this.titleSuffix = routesData.titleSuffix || '';
    this.langFn = routesData.langFn;
    this.curRoute = this.basePath + '/';
    this.rcCallback = rcCallback;
    this.redirectRoute = null;
    this.curRouteData = {
      route: this.basePath + '/',
      source: null,
      params: {},
      component: null,
    };
    this.prevRoute = null;
    this.prevRouteData = null;
    if (!componentProps) componentProps = {};
    this.componentProps = componentProps;
    this.initRouter(routesData.routes, attachId);
  }

  initRouter = async (routes, attachId) => {
    this.setRoute();
    let changeUrlPath = false;
    if (this.curRoute.length < this.basePath.length) {
      this.curRoute = this.basePath + '/';
      changeUrlPath = true;
    }
    if (!routes) {
      this.notFound();
      return;
    }
    for (let i = 0; i < routes.length; i++) {
      // First loop check a redirect against curRoute
      routes[i].route = this.basePath + routes[i].route;
      if (routes[i].redirect) {
        routes[i].redirect = this.basePath + routes[i].redirect;
        if (routes[i].redirect === routes[i].route) {
          const errorMsg = `Route's redirect cannot be the same as the route '${routes[i].route}'.`;
          logger.error(errorMsg);
          throw new Error(errorMsg);
        }
        if (this._compareRoutes(routes[i].route, this.curRoute)) {
          this.curRoute = routes[i].redirect;
          changeUrlPath = true;
        }
      }
      if (this._compareRoutes(routes[i].route, this.curRoute, true) && routes[i].beforeDraw) {
        const newRoute = await routes[i].beforeDraw({
          route: routes[i],
          curRouteData: this.curRouteData,
          curRoute: this.curRoute,
          basePath: this.basePath,
          componentProps: this.componentProps,
          prevRouteData: null,
          prevRoute: null,
        });
        if (newRoute) {
          this.curRoute = this.basePath + newRoute;
          changeUrlPath = true;
        }
      }
    }
    let routeFound = false;
    for (let i = 0; i < routes.length; i++) {
      // Check all routes and push them to this.routes
      if (routes[i].redirect) {
        this.routes.push(routes[i]);
        continue;
      }
      routes[i].attachId = attachId;
      this.routes.push(routes[i]);
      if (this._compareRoutes(routes[i].route, this.curRoute) && !this.curRoute.includes(':')) {
        routes[i].attachId = attachId;
        this._createNewView(routes[i]);
        routeFound = true;
        this.curRouteData = routes[i];
        document.title = this._createPageTitle(routes[i]);
      }
      if (!routeFound) {
        const params = this._getRouteParams(this.routes[i].route, this.curRoute);
        if (params) {
          routes[i].attachId = attachId;
          this._createNewView(routes[i]);
          routeFound = true;
          this.curRouteData = routes[i];
          this.curRouteData.params = params;
          document.title = this._createPageTitle(routes[i]);
        }
      }
    }
    if (!routeFound) {
      this.notFound();
    }
    window.onpopstate = this.routeChangeListener;
    if (changeUrlPath) {
      const routeState = this._createRouteState();
      window.history.pushState(routeState, '', this.curRoute);
      this.curHistoryState = routeState;
    }
    routerInitiated = true;
  };

  routeChangeListener = (e) => {
    this.setRoute();
    this.changeRoute(this.curRoute, {
      forceUpdate: true,
      ignoreBasePath: true,
      doNotSetState: true,
    });
    this.curHistoryState = e.state || {};
  };

  _createPageTitle = (route) => {
    let title = route.title;
    if (this.langFn) {
      if (route.titleKey) {
        title = this.langFn(route.titleKey);
      } else {
        logger.warn(
          `Router has a langFn defined, but route '${route.id}' is missing the titleKey.`
        );
      }
    }
    if (!route.title && !route.titleKey) {
      logger.warn(`Route '${route.id}' is missing the title. Setting id as title.`);
      title = route.id;
    }
    return this.titlePrefix + title + this.titleSuffix;
  };

  _createRouteState = () => {
    const newState = Object.assign({}, this.nextHistoryState);
    this.nextHistoryState = {};
    this.curHistoryState = {};
    return newState;
  };

  replaceRoute = (route, ignoreBasePath) => {
    let basePath = this.basePath;
    if (ignoreBasePath) basePath = '';
    route = basePath + route;
    const routeState = this._createRouteState();
    window.history.replaceState(routeState, '', route);
  };

  setNextHistoryState = (newState) => {
    this.nextHistoryState = Object.assign(this.nextHistoryState, newState);
  };

  setCurHistoryState = (newState) => {
    this.curHistoryState = Object.assign(this.curHistoryState, newState);
    window.history.replaceState(this.curHistoryState, '');
  };

  getCurHistoryState = () => this.curHistoryState;

  // Options: Object
  // - forceUpdate: Boolean
  // - ignoreBasePath: Boolean
  // - doNotSetState: Boolean
  // - replaceState: Boolean (if true, doNotSetState is also true, so no need to declare it)
  changeRoute = async (route, options) => {
    if (!options) options = {};
    const forceUpdate = options.forceUpdate,
      ignoreBasePath = options.ignoreBasePath,
      doNotSetState = options.doNotSetState,
      replaceState = options.replaceState;
    let basePath = this.basePath;
    if (ignoreBasePath) basePath = '';
    route = basePath + route;
    for (let i = 0; i < this.routes.length; i++) {
      // Before draw check
      if (this._compareRoutes(this.routes[i].route, route, true) && this.routes[i].beforeDraw) {
        const newRoute = await this.routes[i].beforeDraw({
          route: this.routes[i],
          curRouteData: this.curRouteData,
          curRoute: this.curRoute,
          basePath: this.basePath,
          componentProps: this.componentProps,
          prevRouteData: this.prevRouteData,
          prevRoute: this.prevRouteData,
        });
        if (newRoute) route = basePath + newRoute;
        break;
      }
    }
    for (let i = 0; i < this.routes.length; i++) {
      // Check if new route is a redirect
      if (this.routes[i].redirect && this._compareRoutes(this.routes[i].route, route)) {
        route = this.routes[i].redirect;
        break;
      }
    }
    if (this._compareRoutes(route, this.curRoute) && !forceUpdate) return;
    if (forceUpdate) {
      this.curRouteData.component.discard(true);
      this.curRouteData.component = null;
    }

    if (!doNotSetState && !replaceState) {
      const routeState = this._createRouteState();
      window.history.pushState(routeState, '', route);
    } else if (replaceState) {
      this.replaceRoute(route, true);
    }

    this.prevRoute = this.curRoute;
    this.setRoute();
    let routeFound = false;
    for (let i = 0; i < this.routes.length; i++) {
      if (this._compareRoutes(this.routes[i].route, route) && !route.includes(':')) {
        routeFound = true;
        this.prevRouteData = Object.assign({}, this.curRouteData);
        this.curRouteData = this.routes[i];
        document.title = this._createPageTitle(this.routes[i]);
        this._createNewView(this.routes[i]);
        break;
      }
      const params = this._getRouteParams(this.routes[i].route, route);
      if (params) {
        routeFound = true;
        this.prevRouteData = Object.assign({}, this.curRouteData);
        this.curRouteData = this.routes[i];
        this.curRouteData.params = params;
        document.title = this._createPageTitle(this.routes[i]);
        this._createNewView(this.routes[i]);
        break;
      }
    }
    if (!routeFound) {
      this.notFound();
    }
    this.rcCallback(this.curRoute);
  };

  _compareRoutes = (first, second, checkWithParams) => {
    first = first.split('?')[0];
    second = second.split('?')[0];
    if (checkWithParams && (first.includes(':') || second.includes(':'))) {
      const firstParts = first.split('/');
      const secondParts = second.split('/');
      let length = firstParts.length;
      if (secondParts.length > firstParts.length) length = secondParts.length;
      for (let i = 0; i < length; i++) {
        if (firstParts[i] && firstParts[i].includes(':')) {
          firstParts[i] = secondParts[i];
        } else if (secondParts[i] && secondParts[i].includes(':')) {
          secondParts[i] = firstParts[i];
        }
      }
      first = firstParts.join('/');
      second = secondParts.join('/');
    }
    return first === second || first + '/' === second || first === second + '/';
  };

  getRoute = (noBasePath) => {
    if (noBasePath) return this.curRoute.replace(this.basePath, '');
    return this.curRoute;
  };

  getRouteData = () => ({ ...this.curRouteData, prevRouteData: this.prevRouteData });

  getRouteParams = () => this.curRouteData.params;

  isCurrent = (route) =>
    this.basePath + route === this.curRoute ||
    this.basePath + route === this.curRoute + '/' ||
    this.basePath + route + '/' === this.curRoute;

  setRoute = () => {
    let path = location.pathname;
    if (!path) {
      this.curRoute = this.basePath + '/';
    } else {
      // Remove last slash if found
      if (path.length > 1 && path.substring(path.length - 1, path.length) === '/') {
        path = path.substring(0, path.length - 1);
      }
      this.curRoute = path;
    }
  };

  addRoute = (routeData) => {
    routeData.route = this.basePath + routeData.route;
    this.routes.push(routeData);
    if (this._compareRoutes(routeData.route, this.curRoute)) {
      this.curRouteData = routeData;
    }
  };

  notFound = () => {
    let template;
    for (let i = 0; i < this.routes.length; i++) {
      if (this.routes[i].is404) {
        template = this.routes[i];
        break;
      }
    }
    if (!template) {
      const errorMsg = 'Could not find 404 template.';
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    this.prevRouteData = Object.assign({}, this.curRouteData);
    this.curRouteData = template;
    document.title = this._createPageTitle(template);
    this._createNewView(template);
  };

  draw = () => {
    if (this.prevRouteData?.component) {
      this.prevRouteData.component.discard(true);
      this.prevRouteData.component = null;
    }
    this.curRouteData.component.draw();
  };

  remove = () => {
    if (this.prevRouteData?.component) {
      this.prevRouteData.component.discard(true);
    }
    if (this.curRouteData?.component) {
      this.curRouteData.component.discard(true);
    }
    RouterRef = null;
    this.routes = [];
    this.nextHistoryState = {};
    this.curHistoryState = {};
    this.basePath = undefined;
    this.titlePrefix = undefined;
    this.titleSuffix = undefined;
    this.langFn = undefined;
    this.rcCallback = undefined;
    this.redirectRoute = undefined;
    this.curRouteData = undefined;
    this.prevRoute = undefined;
    this.prevRouteData = undefined;
    this.componentProps = undefined;
    routerInitiated = false;
  };

  _createNewView = (routeData) => {
    routeData.component = new routeData.source({
      ...this.componentProps,
      id: routeData.id,
      attachId: routeData.attachId,
      title: routeData.title,
      titleKey: routeData.titleKey,
      template: routeData.template,
      extraRouteData: routeData.extraRouteData,
    });
    if (!routeData.component?.parent?.elem) {
      routeData.component.parent = routeData.component.getComponentById(routeData.attachId);
    }
  };

  _getRouteParams = (model, route) => {
    if (!model.includes(':')) return false;
    const modelParts = model.split('/');
    route = route.split('?')[0];
    const routeParts = route.split('/');
    let length = modelParts.length;
    if (routeParts.length > modelParts.length) length = routeParts.length;
    let params = {};
    for (let i = 0; i < length; i++) {
      if (modelParts[i] && modelParts[i].includes(':')) {
        if (!routeParts[i]) return false;
        const paramName = modelParts[i].replace(':', '');
        params[paramName] = routeParts[i];
      } else {
        if (
          !modelParts[i] === undefined ||
          !routeParts[i] === undefined ||
          modelParts[i] !== routeParts[i]
        ) {
          return false;
        }
      }
    }
    return params;
  };
}

export let RouterRef = null;
export const setLoggerCallback = (callback) => logger.setCallback(callback);
export const isLoggerQuiet = (isQuiet) => (isQuiet ? logger.turnOff() : logger.turnOn());

export default Router;
