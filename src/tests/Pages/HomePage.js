import Component from '../../Lighter/Component';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    if (this.props.introduction) {
      this.add({ _id: 'introduction-0', text: this.props.introduction }).draw();
    }
    this.add({ _id: 'home-page', text: 'Home page' }).draw();
  };
}

export default HomePage;
