import Component from '../../Lighter/Component';

class FourOFourPage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    if (this.props.introduction) {
      this.add({ _id: 'introduction-2', text: this.props.introduction }).draw();
    }
    this.add({ _id: 'fourofour-page', text: '404' }).draw();
  };
}

export default FourOFourPage;
