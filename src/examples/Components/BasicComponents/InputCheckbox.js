import InputBase from './InputBase';

// props:
// - value: boolean (whether the checkbox is checked or not)

// InputBase props:
// - label: string/template (input field's label string)
// - disabled: boolean (whether the input elem is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - noChangeListener: boolean (will not create an onChange listener)
// - noFocusListener: boolean (will not create an onFocus listener)
// - noBlurListener: boolean (will not create an onBlur listener)
// - autoFocus = boolean (whether the input is focused after the first drawing or not, default false)
class InputCheckbox extends InputBase {
  constructor(props) {
    super(props);
    this.label = props.label || '';
    this.value = props.value || false;
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

  _createOnChangeListener = () => {
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

  // addListeners = () => {
  //   const inputElem = this.getInputElem();
  //   this.addListener({
  //     id: 'onchange',
  //     target: inputElem,
  //     type: 'change',
  //     fn: (e) => {
  //       const value = e.target.checked;
  //       if (this.value === value) return;
  //       this.changeHappened = true;
  //       this.value = value;
  //       if (this.props.onChange) this.props.onChange(e, value, this);
  //     },
  //   });
  // };
}

export default InputCheckbox;
