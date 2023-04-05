import Component from '../../Lighter/Component';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ _id: 'home-page', text: 'Home page' }).draw();
  };
}

export default HomePage;
