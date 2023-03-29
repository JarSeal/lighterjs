import Component from '../../../Lighter/Component';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ text: 'Home page' }).draw();
  };
}

export default HomePage;
