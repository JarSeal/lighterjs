import Component from '../../Lighter/Component';

class SubPageTwo extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({ _id: 'sub-page-two', text: 'More page' }).draw();
  };
}

export default SubPageTwo;
