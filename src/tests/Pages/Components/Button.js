import Component from '../../../Lighter/Component';

class Button extends Component {
  constructor(props) {
    super(props);
    this.props.template = '<button class="button"></button>';
  }

  addListeners = () => {
    this.addListener({
      id: 'btn-click-listen',
      type: 'click',
      fn: (e) => {
        if (this.props.onClick) {
          this.props.onClick(e);
        }
      },
    });
  };
}

export default Button;
