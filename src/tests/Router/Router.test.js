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
    expect(error).toEqual(`Route 'route-home' is missing the 'route' prop.`);

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
    expect(error).toEqual(`Route is missing the 'id' prop.`);

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
    expect(error).toEqual(`Route 'route-home' is missing the 'source' prop.`);

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

    router.remove();
    appRoot.discard(true);
  });

  // titlePrefix and titleSuffix tests

  // langFn test

  // componentData test

  // beforeDraw test

  // changeRoute and history (backbutton on regular and forced changeRoute) tests
});
