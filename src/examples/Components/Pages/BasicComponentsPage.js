import Component from '../../../Lighter/Component';

class BasicComponentsPage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ id: 'home-page', text: 'Basic Components page' }).draw();
  };
}

export default BasicComponentsPage;
