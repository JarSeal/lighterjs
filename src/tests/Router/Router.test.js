import { Router, Component, isRouterLoggerQuiet } from '../../Lighter';
import MainMenu from '../Pages/Components/MainMenu';
import { createEmptyRootDiv, Pages } from '../testUtils';

const TWO_ROUTES = {
  routes: [
    {
      route: '/',
      id: 'route-home',
      source: Pages.HomePage,
      title: 'Home',
    },
    {
      route: '/first-page',
      id: 'route-first-page',
      source: Pages.FirstPage,
      title: 'First page',
    },
    {
      route: '/404',
      id: 'route-four-o-four',
      source: Pages.FourOFourPage,
      is404: true,
      title: '404: Page Not Found',
    },
  ],
};
const REQUIRED_PARAMS_MSG = 'Required params: new Route(routesData, attachId, rcCallback);';

describe('Router class tests', () => {
  beforeAll(() => {
    isRouterLoggerQuiet(true);
    createEmptyRootDiv();
  });

  // Create router and change route
  it('should create routes (and a 404 route) and update the url path accordingly', () => {
    const ROUTES = {
      routes: [
        {
          route: '/',
          id: 'route-home',
          source: Pages.HomePage,
          title: 'Home',
        },
        {
          route: '/first-page',
          id: 'route-first-page',
          source: Pages.FirstPage,
          title: 'First page',
        },
        {
          route: '/404',
          id: 'route-four-o-four',
          source: Pages.FourOFourPage,
          is404: true,
          title: '404: Page Not Found',
        },
      ],
    };
    const mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'First page', path: '/first-page' },
      { text: 'Link to nowhere', path: '/page-that-doesnt-exist' },
    ];

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      mainMenu.draw();
      router.draw();
    };

    const router = new Router(ROUTES, 'appRoot', paintPage);
    const mainMenu = appRoot.add(new MainMenu({ menuData: mainMenuData }));

    paintPage();

    expect(document.getElementById('home-page').textContent).toEqual('Home page');
    expect(document.getElementById('main-menu-item-0').classList.contains('current')).toBeTruthy();
    expect(document.title).toEqual('Home');

    document.querySelector('#main-menu-item-1 button').click();

    expect(document.getElementById('first-page').textContent).toEqual('First page');
    expect(document.getElementById('main-menu-item-1').classList.contains('current')).toBeTruthy();
    expect(document.title).toEqual('First page');

    document.querySelector('#main-menu-item-2 button').click();

    expect(document.getElementById('fourofour-page').textContent).toEqual('404');
    expect(document.getElementById('main-menu-item-2').classList.contains('current')).toBeTruthy();
    expect(document.title).toEqual('404: Page Not Found');

    router.remove();
    appRoot.discard(true);
  });

  // 404 route is missing
  it('should fail when no 404 route is found', async () => {
    const ROUTES = { routes: TWO_ROUTES.routes.filter((_, i) => i < 2) };

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    let error = '';
    try {
      new Router(ROUTES, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }

    expect(error).toEqual('Could not find 404 template.');

    appRoot.discard(true);
  });

  // routerInitiated twice test
  it('should fail when a second Router is initiated', () => {
    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => router.draw();

    const router = new Router(TWO_ROUTES, 'appRoot', paintPage);

    let error = '';
    try {
      new Router(TWO_ROUTES, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Router has already been initiated. Only one router per app is allowed.');

    router.remove();
    appRoot.discard(true);
  });

  // routesData, routesData.routes, or routesData.routes.length = 0 tests
  it('should fail when routesData or routesData.routes is missing, or when routesData.routes is empty or routes has missing props', () => {
    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    let error = '';
    try {
      new Router(null, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error.startsWith('Missing routesData parameter')).toBeTruthy();

    error = '';
    try {
      new Router({}, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error.startsWith('Missing routesData parameter')).toBeTruthy();

    error = '';
    try {
      new Router({ routes: [] }, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error.startsWith('Missing routesData parameter')).toBeTruthy();

    try {
      const routesData = {
        routes: TWO_ROUTES.routes.map((r) => ({
          id: r.id,
          source: r.source,
          title: r.title,
          is404: r.is404,
        })),
      };
      new Router(routesData, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual(`Route 'route-home' is missing the 'route' property.`);

    try {
      const routesData = {
        routes: TWO_ROUTES.routes.map((r) => ({
          route: r.route,
          source: r.source,
          title: r.title,
          is404: r.is404,
        })),
      };
      new Router(routesData, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual(`Route is missing the 'id' property.`);

    try {
      const routesData = {
        routes: TWO_ROUTES.routes.map((r) => ({
          id: r.id,
          route: r.route,
          title: r.title,
          is404: r.is404,
        })),
      };
      new Router(routesData, 'appRoot', () => {});
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual(`Route 'route-home' is missing the 'source' property.`);

    appRoot.discard(true);
  });

  // attachId and rcCallback missing tests
  it('should fail when attachId is missing', () => {
    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    let error = '';
    try {
      new Router(TWO_ROUTES);
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Missing attachId parameter. ' + REQUIRED_PARAMS_MSG);

    error = '';
    try {
      new Router(TWO_ROUTES, 'appRoot');
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual(
      'Missing rcCallback (route change callback) parameter / function. ' + REQUIRED_PARAMS_MSG
    );

    appRoot.discard(true);
  });

  // basePath test
  it('should create a base path for all the routes', () => {
    const mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'First page', path: '/first-page' },
      { text: 'Link to nowhere', path: '/page-that-doesnt-exist' },
    ];

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      mainMenu.draw();
      router.draw();
    };

    const basePath = '/mybasepath';
    const routesData = { ...TWO_ROUTES, basePath };
    const router = new Router(routesData, 'appRoot', paintPage);
    const mainMenu = appRoot.add(new MainMenu({ menuData: mainMenuData }));

    paintPage();

    const baseUrl = 'http://localhost' + basePath;

    document.querySelector('#main-menu-item-0 button').click();
    expect(window.location.href).toEqual(`${baseUrl}/`);

    document.querySelector('#main-menu-item-1 button').click();
    expect(window.location.href).toEqual(`${baseUrl}/first-page`);

    document.querySelector('#main-menu-item-2 button').click();
    expect(window.location.href).toEqual(`${baseUrl}/page-that-doesnt-exist`);

    document.querySelector('#main-menu-item-0 button').click();

    // Fix the TWO_ROUTES, because their routes are now including the basePath
    for (let i = 0; i < TWO_ROUTES.routes.length; i++) {
      TWO_ROUTES.routes[i].route = TWO_ROUTES.routes[i].route.replace(basePath, '');
    }

    router.remove();
    appRoot.discard(true);
  });

  // titlePrefix and titleSuffix tests
  it('should create a prefix and suffix for each document title', () => {
    const mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'First page', path: '/first-page' },
      { text: 'Link to nowhere', path: '/page-that-doesnt-exist' },
    ];

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      mainMenu.draw();
      router.draw();
    };

    const titlePrefix = 'MYSITE: ';
    let routesData = { ...TWO_ROUTES, titlePrefix };
    let router = new Router(routesData, 'appRoot', paintPage);
    const mainMenu = appRoot.add(new MainMenu({ menuData: mainMenuData }));

    paintPage();

    document.querySelector('#main-menu-item-0 button').click();
    expect(document.title).toEqual(titlePrefix + TWO_ROUTES.routes[0].title);

    document.querySelector('#main-menu-item-1 button').click();
    expect(document.title).toEqual(titlePrefix + TWO_ROUTES.routes[1].title);

    router.remove();

    const titleSuffix = ' - MYSITE';
    routesData = { ...TWO_ROUTES, titleSuffix };
    router = new Router(routesData, 'appRoot', paintPage);

    paintPage();

    document.querySelector('#main-menu-item-0 button').click();
    expect(document.title).toEqual(TWO_ROUTES.routes[0].title + titleSuffix);

    document.querySelector('#main-menu-item-1 button').click();
    expect(document.title).toEqual(TWO_ROUTES.routes[1].title + titleSuffix);

    router.remove();
    appRoot.discard(true);
  });

  // langFn test
  it('should use the titleId for a translated text asset as the document title', () => {
    const mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'First page', path: '/first-page' },
      { text: 'Link to nowhere', path: '/page-that-doesnt-exist' },
    ];

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      mainMenu.draw();
      router.draw();
    };

    let LANGUAGE = 'eng';
    const langFn = (key) => {
      const translations = {
        eng: {
          'Home page': 'Home page',
          'First page': 'First page',
          '404: Page not found': '404: Page not found',
        },
        swe: {
          'Home page': 'Hemsida',
          'First page': 'Förstä sidan',
          '404: Page not found': '404: Sidan hittas inte',
        },
      };
      return translations[LANGUAGE][key];
    };
    TWO_ROUTES.routes[0].titleKey = 'Home page';
    TWO_ROUTES.routes[1].titleKey = 'First page';
    TWO_ROUTES.routes[2].titleKey = '404: Page not found';
    const routesData = { ...TWO_ROUTES, langFn };
    const router = new Router(routesData, 'appRoot', paintPage);
    const mainMenu = appRoot.add(new MainMenu({ menuData: mainMenuData }));

    paintPage();

    document.querySelector('#main-menu-item-0 button').click();
    expect(document.title).toEqual(langFn('Home page'));

    document.querySelector('#main-menu-item-1 button').click();
    expect(document.title).toEqual(langFn('First page'));

    document.querySelector('#main-menu-item-2 button').click();
    expect(document.title).toEqual(langFn('404: Page not found'));

    LANGUAGE = 'swe';

    document.querySelector('#main-menu-item-0 button').click();
    expect(document.title).toEqual(langFn('Home page'));

    document.querySelector('#main-menu-item-1 button').click();
    expect(document.title).toEqual(langFn('First page'));

    document.querySelector('#main-menu-item-2 button').click();
    expect(document.title).toEqual(langFn('404: Page not found'));

    // Reset TWO_ROUTES data
    delete TWO_ROUTES.routes[0].titleKey;
    delete TWO_ROUTES.routes[1].titleKey;
    delete TWO_ROUTES.routes[2].titleKey;

    router.remove();
    appRoot.discard(true);
  });

  // changeRoute and history (backbutton on default and with changeRoute options) tests
  it("should changeRoute and history data (and with changeRoute options), and also work with back and forward history API's", async () => {
    const mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'First page', path: '/first-page' },
      { text: 'Link to nowhere', path: '/page-that-doesnt-exist' },
    ];

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      mainMenu.draw();
      router.draw();
    };

    const basePath = '/basepath';
    const routesData = { ...TWO_ROUTES, basePath };
    const router = new Router(routesData, 'appRoot', paintPage);
    const mainMenu = appRoot.add(new MainMenu({ menuData: mainMenuData }));

    paintPage();

    const baseUrl = 'http://localhost' + basePath;

    document.querySelector('#main-menu-item-0 button').click();
    expect(location.href).toEqual(baseUrl + '/');
    expect(document.title).toEqual('Home');
    expect(document.getElementById('home-page').textContent).toEqual('Home page');

    router.changeRoute('/first-page');
    expect(location.href).toEqual(baseUrl + '/first-page');
    expect(document.title).toEqual('First page');
    expect(document.getElementById('first-page').textContent).toEqual('First page');

    router.changeRoute('/page-that-doesnt-exist');
    expect(location.href).toEqual(baseUrl + '/page-that-doesnt-exist');
    expect(document.title).toEqual('404: Page Not Found');
    expect(document.getElementById('fourofour-page').textContent).toEqual('404');

    history.back();
    await new Promise((r) => setTimeout(r, 200)); // history.back is asynchronous, so we need to wait a bit

    expect(location.href).toEqual(baseUrl + '/first-page');
    expect(document.title).toEqual('First page');
    expect(document.getElementById('first-page').textContent).toEqual('First page');

    history.back();
    await new Promise((r) => setTimeout(r, 200)); // history.back is asynchronous, so we need to wait a bit

    expect(location.href).toEqual(baseUrl + '/');
    expect(document.title).toEqual('Home');
    expect(document.getElementById('home-page').textContent).toEqual('Home page');

    history.forward();
    await new Promise((r) => setTimeout(r, 200)); // history.back is asynchronous, so we need to wait a bit

    expect(location.href).toEqual(baseUrl + '/first-page');
    expect(document.title).toEqual('First page');
    expect(document.getElementById('first-page').textContent).toEqual('First page');

    // Replace state test (replaces the previous state so next back button is the page on before this)
    router.changeRoute('/page-that-doesnt-exist', { replaceState: true });

    expect(location.href).toEqual(baseUrl + '/page-that-doesnt-exist');
    expect(document.title).toEqual('404: Page Not Found');
    expect(document.getElementById('fourofour-page').textContent).toEqual('404');

    history.back();
    await new Promise((r) => setTimeout(r, 200)); // history.back is asynchronous, so we need to wait a bit

    expect(location.href).toEqual(baseUrl + '/');
    expect(document.title).toEqual('Home');
    expect(document.getElementById('home-page').textContent).toEqual('Home page');

    let historyLength = history.length;
    // This shouldn't add a history entry, because we are already in that path
    router.changeRoute('/');

    expect(history.length).toEqual(historyLength);

    // This should force a refresh and add a history entry
    router.changeRoute('/', { forceUpdate: true });

    // We have now pressed the back button three times and the forward button once, so we are at -2 from the latest entry,
    // and now we added one more entry to history so we are at -1, because the entries after the current position are lost
    expect(history.length).toEqual(historyLength - 1);

    // This should force a refresh but not add a history entry, so it should be -1
    router.changeRoute('/', { forceUpdate: true, doNotSetState: true });

    expect(history.length).toEqual(historyLength - 1);

    // ignoreBasePath test
    router.changeRoute('/first-page', { ignoreBasePath: true });

    expect(location.href).toEqual('http://localhost/first-page');
    expect(document.title).toEqual('404: Page Not Found');
    expect(document.getElementById('fourofour-page').textContent).toEqual('404');

    // Fix the TWO_ROUTES, because their routes are now including the basePath
    for (let i = 0; i < TWO_ROUTES.routes.length; i++) {
      TWO_ROUTES.routes[i].route = TWO_ROUTES.routes[i].route.replace(basePath, '');
    }

    router.remove();
    appRoot.discard(true);
  });

  // page component props test
  it('should pass general props to all router page components', () => {
    const mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'First page', path: '/first-page' },
      { text: 'Link to nowhere', path: '/page-that-doesnt-exist' },
    ];

    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      mainMenu.draw();
      router.draw();
    };

    const introduction = 'My introduction text.';
    const router = new Router({ ...TWO_ROUTES }, 'appRoot', paintPage, {
      introduction,
    });
    const mainMenu = appRoot.add(new MainMenu({ menuData: mainMenuData }));

    paintPage();

    document.querySelector('#main-menu-item-0 button').click();
    expect(location.href).toEqual('http://localhost/');
    expect(document.title).toEqual('Home');
    expect(document.getElementById('home-page').textContent).toEqual('Home page');
    expect(document.getElementById('introduction-0').textContent).toEqual(introduction);

    document.querySelector('#main-menu-item-1 button').click();
    expect(location.href).toEqual('http://localhost/first-page');
    expect(document.title).toEqual('First page');
    expect(document.getElementById('first-page').textContent).toEqual('First page');
    expect(document.getElementById('introduction-1').textContent).toEqual(introduction);

    document.querySelector('#main-menu-item-2 button').click();
    expect(location.href).toEqual('http://localhost/page-that-doesnt-exist');
    expect(document.title).toEqual('404: Page Not Found');
    expect(document.getElementById('fourofour-page').textContent).toEqual('404');
    expect(document.getElementById('introduction-2').textContent).toEqual(introduction);

    expect(router.routes[0].component.props.introduction).toEqual(introduction);
    expect(router.routes[1].component.props.introduction).toEqual(introduction);
    expect(router.routes[2].component.props.introduction).toEqual(introduction);

    router.remove();
    appRoot.discard(true);
  });

  // route and query params, and redirect tests
  it('should get route and query params, and redirect a route', () => {
    const appRoot = new Component({ _id: 'appRoot', attachId: 'root' });
    appRoot.draw();

    const paintPage = () => {
      router.draw();
    };

    const routes = [
      {
        route: '/',
        id: 'route-home',
        source: Pages.HomePage,
        title: 'Home',
      },
      {
        route: '/first-page',
        id: 'route-first-page',
        source: Pages.FirstPage,
        title: 'First Page',
      },
      {
        route: '/first-page/sub-page/:someId',
        id: 'route-sub-page-1',
        source: Pages.SubPageOne,
        title: 'Sub Page One',
      },
      {
        route: '/first-page/sub-page',
        redirect: '/first-page',
      },
      {
        route: '/first-page/sub-page/:someId/more-page',
        id: 'route-sub-page-2',
        source: Pages.SubPageTwo,
        title: 'Sub Page Two',
      },
      {
        route: '/404',
        id: 'route-four-o-four',
        source: Pages.FourOFourPage,
        is404: true,
        title: '404: Page Not Found',
      },
    ];
    const router = new Router({ routes }, 'appRoot', paintPage);

    paintPage();

    router.changeRoute('/first-page/sub-page/myParamId');
    expect(router.curRouteData.params.someId).toEqual('myParamId');
    expect(document.getElementById('sub-page-one').textContent).toEqual('Route param: myParamId');

    router.changeRoute('/first-page/sub-page/someOtherId');
    expect(router.curRouteData.params.someId).toEqual('someOtherId');
    expect(document.getElementById('sub-page-one').textContent).toEqual('Route param: someOtherId');

    router.changeRoute('/first-page/sub-page/someThirdId/more-page?myQueryParam=amazing');
    expect(router.curRouteData.params.someId).toEqual('someThirdId');
    expect(document.getElementById('sub-page-two').textContent).toEqual('More page');
    const queryParams = new Proxy(new URLSearchParams(location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    expect(queryParams.myQueryParam).toEqual('amazing');

    // Redirect
    router.changeRoute('/first-page/sub-page');
    expect(location.href).toEqual('http://localhost/first-page');
    expect(document.title).toEqual('First Page');
    expect(document.getElementById('first-page').textContent).toEqual('First page');

    router.remove();
    appRoot.discard(true);
  });

  // beforeDraw test
});
