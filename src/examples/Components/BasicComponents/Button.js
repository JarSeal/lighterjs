import Component from '../../../Lighter/Component';

// Custom props:
// - onClick: function(event) (The click function with the event property)
// - autoFocus = boolean (whether the button is focused after a draw or not, default false)
class Button extends Component {
  constructor(props) {
    super(props);
    this.props.template = '<button class="button"></button>';
    this.autoFocus = props.autoFocus || false;
  }

  paint = (props) => {
    this.autoFocus = props.autoFocus || false;
    if (this.autoFocus) this.elem.focus();
  };

  addListeners = () => {
    this.addListener({
      id: 'btn-click-listen',
      type: 'click',
      fn: (e) => this.props.onClick(e),
    });
  };
}

export default Button;
