import { Component } from '../../../Lighter';

// Common props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - maxlength: number (input field's max length of characters)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - required: boolean (whether an input is required or not, default false)
// - focusOnFirstDraw = boolean (whether the input is focused after the first drawing or not, default false)
class InputText extends Component {
  constructor(props) {
    super(props);
    this.label = props.label || '';
    this.value = props.value || '';
    this.maxlength = props.maxlength || null;
    this.required = props.required || false;
    this.focusOnFirstDraw = props.focusOnFirstDraw || false;
    this.props.template = `<div class="inputText formElem${this.label ? '' : ' noLabel'}">
      <label class="inputTextInner inputInner" for="${this.id}">
        <span class="inputTextLabel inputLabel">${this.label}</span>
        <input class="input" type="text" value="${this.value}" id="${this.id}"
          ${this.maxlength ? `maxlength=${this.maxlength}` : ''}
        />
      </label>
      <div class="inputErrorMsg"></div>
    </div>`;
  }

  paint = () => {
    if (this.focusOnFirstDraw) this.elem.querySelector('.input').focus();
  };

  addListeners = () => {
    const inputElem = this.elem.querySelector('.input');
    if (this.props.onChange) {
      this.addListener({
        id: 'onchange',
        target: inputElem,
        type: 'keyup',
        fn: (e) => {
          const value = e.target.value;
          if (this.value === value) return;
          this.value = value;
          this.props.onChange(e, value, this);
        },
      });
    }
    this.addListener({
      id: 'focus',
      target: inputElem,
      type: 'focus',
      fn: (e) => {
        this.elem.classList.add('focus');
        if (this.props.onFocus) {
          this.props.onFocus(e, this.value, this);
        }
      },
    });
    this.addListener({
      id: 'blur',
      target: inputElem,
      type: 'blur',
      fn: (e) => {
        this.elem.classList.remove('focus');
        if (this.props.onBlur) {
          this.props.onBlur(e, this.value, this);
        }
      },
    });
  };
}

export default InputText;
