import Component from '../../../Lighter/Component';

class FourOFourPage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ text: '404 - Page not found' }).draw();
  };
}

export default FourOFourPage;
