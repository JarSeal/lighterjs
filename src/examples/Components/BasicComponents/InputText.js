import { Component } from '../../../Lighter';

// Common props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - maxlength: number (input field's max length of characters)
// - password: boolean (whether the input elem's type is password or not, default false = type="text")
// - disabled: boolean (whether the input elem is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - focusOnFirstDraw = boolean (whether the input is focused after the first drawing or not, default false)
// - multiline = boolean (whether the input field is a textarea or input type=text/password, default false)
class InputText extends Component {
  constructor(props) {
    super(props);
    this.label = props.label || '';
    this.value = props.value || '';
    this.maxlength = props.maxlength || null;
    this.password = props.password || false;
    this.focusOnFirstDraw = props.focusOnFirstDraw || false;
    this.changeHappened = false;
    this.multiline = props.multiline || false;
    if (props.multiline) {
      this.props.template = `<div
        class="inputText inputTextMulti formElem${this.label ? '' : ' noLabel'}"
      >
        <label class="inputInner" for="${this.id}">
          <span class="inputLabel">${this.label}</span>
          <textarea class="inputElem" id="${this.id}"
            ${this.maxlength ? `maxlength=${this.maxlength}` : ''}
          >${this.value}</textarea>
        </label>
        <div class="inputErrorMsg"></div>
      </div>`;
    } else {
      this.props.template = `<div
        class="inputText inputTextSingle formElem${this.label ? '' : ' noLabel'}"
      >
        <label class="inputInner" for="${this.id}">
          <span class="inputLabel">${this.label}</span>
          <input class="inputElem" type="${this.password ? 'password' : 'text'}"
            value="${this.value}" id="${this.id}"
            ${this.maxlength ? `maxlength=${this.maxlength}` : ''}
          />
        </label>
        <div class="inputErrorMsg"></div>
      </div>`;
    }
  }

  paint = () => {
    this.disabled = this.props.disabled;
    this.getInputElem().disabled = this.disabled;
    this.disabled ? this.elem.classList.add('disabled') : this.elem.classList.remove('disabled');
    if (this.focusOnFirstDraw) this.getInputElem().focus();
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
      type: 'keyup',
      fn: (e) => {
        const value = e.target.value;
        if (this.value === value) return;
        this.changeHappened = true;
        this.value = value;
        this.props.onChange(e, value, this);
      },
    });
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
