import Component from '../../../Lighter/Component';

// Custom props:
// - onClick: function(event) (The click function with the event property)
class Button extends Component {
  constructor(props) {
    super(props);
    this.props.template = '<button class="button"></button>';
  }

  addListeners = () => {
    this.addListener({
      id: 'btn-click-listen',
      type: 'click',
      fn: (e) => this.props.onClick(e),
    });
  };
}

export default Button;
