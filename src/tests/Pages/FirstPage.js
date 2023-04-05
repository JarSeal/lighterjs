import Component from '../../Lighter/Component';

class FirstPage extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ _id: 'first-page', text: 'First page' }).draw();
  };
}

export default FirstPage;
