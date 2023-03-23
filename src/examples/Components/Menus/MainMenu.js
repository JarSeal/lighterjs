import Component from '../../../Lighter/Component';
import Button from '../Button';

class MainMenu extends Component {
  constructor(props) {
    super({ ...props, id: 'MainMenu' });
    this.props.template = '<div class="mainMenu"><ul id="mainMenu"></ul></div>';
  }

  paint = () => {
    this.props.menuData.forEach((item, i) => {
      this.add(
        new MainMenuItem({
          id: 'main-menu-item-' + i,
          attachId: 'mainMenu',
          itemData: item,
        })
      ).draw();
    });
  };
}

class MainMenuItem extends Component {
  constructor(props) {
    super(props);
    this.props.template = '<li></li>';
  }

  paint = () => {
    this.add(
      new Button({
        text: this.props.itemData.text,
        onClick: () => {
          console.log('CLICK', this.props.itemData.path);
        },
      })
    ).draw();
  };
}

export default MainMenu;
