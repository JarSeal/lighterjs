import Component from '../../Lighter/Component';
import MainMenu from './Menus/MainMenu';

class AppRoot extends Component {
  constructor(props) {
    super(props);
    this.mainMenuData = [
      { text: 'Home', path: '/' },
      { text: 'Basic Components', path: '/basic-components' },
    ];
  }

  paint = () => {
    this.add(new MainMenu({ menuData: this.mainMenuData })).draw();
  };
}

export default AppRoot;
