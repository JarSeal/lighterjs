import Component from '../../Lighter2/Component';
import Router from '../../Lighter2/Router';
import MainMenu from './Menus/MainMenu';
import BasicComponentsPage from './Pages/BasicComponentsPage';
import FourOFourPage from './Pages/FourOFourPage';
import HomePage from './Pages/HomePage';

class AppRoot extends Component {
  constructor(props) {
    super(props);
    this.mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'Basic Components', path: '/basic-components' },
    ];
    this.contentAreaId = 'page-area';
    this.ROUTES = {
      routes: [
        {
          route: '/',
          id: 'route-home',
          source: HomePage,
          title: 'Home',
        },
        {
          route: '/basic-components',
          id: 'route-basic-components',
          source: BasicComponentsPage,
          title: 'Basic Components',
        },
        {
          route: '/404',
          id: 'route-four-o-four',
          source: FourOFourPage,
          is404: true,
          title: '404 Page Not Found',
        },
      ],
    };
    this.router = new Router(this.ROUTES, this.id, this.paint);
    this.mainMenu = this.add(new MainMenu({ menuData: this.mainMenuData }));
  }

  paint = () => {
    this.mainMenu.draw();
    this.router.draw();
  };
}

export default AppRoot;
