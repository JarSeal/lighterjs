import Component from '../../Lighter/Component';

class FirstPage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    if (this.props.introduction) {
      this.add({ _id: 'introduction-1', text: this.props.introduction }).draw();
    }
    this.add({ _id: 'first-page', text: 'First page' }).draw();
  };
}

export default FirstPage;
