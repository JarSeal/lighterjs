import Component from '../../../Lighter/Component';

class BasicComponentPage extends Component {
  constructor(props) {
    super(props);
    this.componentId = props.routeParams.componentId;
    this.props.template = `<div>${this.componentId}</div>`;
  }

  paint = () => {
    // this.add({ id: 'basic-component', text: 'Basic Component: ' + this.componentId }).draw();
  };
}

export default BasicComponentPage;
