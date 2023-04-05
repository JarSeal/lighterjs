import { Router, Component, isRouterLoggerQuiet } from '../../Lighter';
import MainMenu from '../Pages/Components/MainMenu';
import { createEmptyRootDiv, Pages } from '../testUtils';

describe('Router class tests', () => {
  beforeAll(() => {
    isRouterLoggerQuiet(true);
    createEmptyRootDiv();
  });

  it('should create two routes (and 404) and update the url path accordingly', () => {
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
      { text: 'Link to nowhere', path: '/page-that-doesnt-exists' },
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

  it('should fail when no 404 route is found', async () => {
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
      ],
    };

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

  // routesData, routesData.routes, or routesData.routes.length = 0 tests

  // attachId missing test

  // rcCallback missing test

  // basePath test

  // titlePrefix and titleSuffix tests

  // langFn test

  // componentData test

  // beforeDraw test

  // changeRoute and history (backbutton on regular and forced changeRoute) tests
});
