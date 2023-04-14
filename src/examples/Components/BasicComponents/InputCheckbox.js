import { Component } from '../../../Lighter';

// Common props:
// - label: string/template (input field's label string)
// - value: boolean (whether the checkbox is checked or not)
// - disabled: boolean (whether the input elem is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - focusOnFirstDraw = boolean (whether the input is focused after the first drawing or not, default false)
class InputCheckbox extends Component {
  constructor(props) {
    super(props);
    this.label = props.label || '';
    this.value = props.value || false;
    this.focusOnFirstDraw = props.focusOnFirstDraw || false;
    this.changeHappened = false;
    this.props.template = `<div
      class="inputCheckbox formElem${this.label ? '' : ' noLabel'}${this.value ? ' checked' : ''}"
    >
      <label class="inputInner" for="${this.id}">
        <span class="inputLabel">${this.label}</span>
        <span class="inputVisualElem"></span>
        <input class="inputElem" type="checkbox" id="${this.id}"
          ${this.value ? 'checked' : ''}
        />
      </label>
      <div class="inputErrorMsg"></div>
    </div>`;
  }

  paint = () => {
    this.disabled = this.props.disabled;
    this.getInputElem().disabled = this.disabled;
    this.disabled ? this.elem.classList.add('disabled') : this.elem.classList.remove('disabled');
    if (this.focusOnFirstDraw) this.getInputElem().focus();
  };

  // toValue: boolean/undefined (if undefined, the value is flipped = !value)
  toggle = (toValue) => {
    if (toValue === undefined) {
      this.value = !this.value;
      this.props.value = this.value;
    } else {
      this.value = Boolean(toValue);
      this.props.value = this.value;
    }
    console.log(toValue, this.value);
    if (this.value) {
      this.elem.classList.add('checked');
      this.getInputElem().checked = true;
      this.getInputElem().setAttribute('checked', 'true');
      return;
    }
    this.elem.classList.remove('checked');
    this.getInputElem().checked = false;
    this.getInputElem().removeAttribute('checked');
  };

  // msg: string (error message to show with the component)
  showError = (msg) => {
    if (!msg) {
      this.noErrors();
      return;
    }
    const errorElem = this.elem.querySelector('.inputErrorMsg');
    errorElem.textContent = msg;
    this.elem.classList.add('error');
  };

  noErrors = () => {
    const errorElem = this.elem.querySelector('.inputErrorMsg');
    errorElem.textContent = '';
    this.elem.classList.remove('error');
  };

  getInputElem = () => {
    if (this.inputElem) return this.inputElem;
    this.inputElem = this.elem.querySelector('.inputElem');
    return this.inputElem;
  };

  addListeners = () => {
    const inputElem = this.getInputElem();
    this.addListener({
      id: 'onchange',
      target: inputElem,
      type: 'change',
      fn: (e) => {
        const value = e.target.checked;
        if (this.value === value) return;
        this.changeHappened = true;
        this.value = value;
        if (this.props.onChange) this.props.onChange(e, value, this);
      },
    });
  };
}

export default InputCheckbox;
