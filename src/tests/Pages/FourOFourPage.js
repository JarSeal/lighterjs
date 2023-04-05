import Component from '../../Lighter/Component';

class FourOFourPage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ _id: 'fourofour-page', text: '404' }).draw();
  };
}

export default FourOFourPage;
