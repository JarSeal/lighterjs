import { Component } from '../../../Lighter';

// Input components' base class that they all extend
// Common props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - disabled: boolean (whether the input elem is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - noChangeListener: boolean (will not create an onChange listener)
// - noFocusListener: boolean (will not create an onFocus listener)
// - noBlurListener: boolean (will not create an onBlur listener)
// - autoFocus = boolean (whether the input is focused after a draw or not, default false)
class InputBase extends Component {
  constructor(props) {
    super(props);
    this._defineProps(props);
    this.changeHappened = false;
  }

  _defineProps = (props) => {
    this.label = props.label || '';
    this.value = props.value || '';
    this.autoFocus = props.autoFocus || false;
    this.noChangeListener = props.noChangeListener || false;
    this.noFocusListener = props.noFocusListener || false;
    this.noBlurListener = props.noBlurListener || false;
    if (props.template) this.inputElem = null;
  };

  painter = (props) => {
    this._defineProps(props);
    this.disabled = this.props.disabled;
    this.getInputElem().disabled = this.disabled;
    this.disabled ? this.elem.classList.add('disabled') : this.elem.classList.remove('disabled');
    if (this.autoFocus) {
      this.elem.classList.add('focus');
      this.getInputElem().focus();
    }
    if (this.afterPaint) this.afterPaint();
  };

  // msg: string (error message to show with the component)
  showError = (msg) => {
    if (!msg) {
      this.clearErrors();
      return;
    }
    const errorElem = this.elem.querySelector('.inputErrorMsg');
    errorElem.textContent = msg;
    this.elem.classList.add('error');
  };

  clearErrors = () => {
    const errorElem = this.elem.querySelector('.inputErrorMsg');
    errorElem.textContent = '';
    this.elem.classList.remove('error');
  };

  getInputElem = () => {
    if (this.inputElem) return this.inputElem;
    this.inputElem = this.elem.querySelector('.inputElem');
    return this.inputElem;
  };

  _createOnChangeListener = () => {};

  addListeners = (props) => {
    const inputElem = this.getInputElem();
    if (!props.noChangeListener) {
      this._createOnChangeListener();
    }
    if (!this.noFocusListener) {
      this.addListener({
        id: 'focus',
        target: inputElem,
        type: 'focus',
        fn: (e) => {
          this.elem.classList.add('focus');
          if (props.onFocus) {
            props.onFocus(e, props.value, this);
          }
        },
      });
    }
    if (!props.noBlurListener) {
      this.addListener({
        id: 'blur',
        target: inputElem,
        type: 'blur',
        fn: (e) => {
          this.elem.classList.remove('focus');
          if (props.onBlur) {
            props.onBlur(e, props.value, this);
          }
        },
      });
    }
    this.painter(props);
  };
}

export default InputBase;
