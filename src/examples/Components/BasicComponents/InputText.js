import { Component } from '../../../Lighter';

// Common props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - maxlength: number (input field's max length of characters)
// - onChange: function(e, value) (input field's on change listener callback)
// - onFocus: function(event, value) (input field's on focus listener callback)
// - onBlur: function(event, value) (input field's on blur listener callback)
class InputText extends Component {
  constructor(props) {
    super(props);
    this.label = props.label || '';
    this.value = props.value || '';
    this.maxlength = props.maxlength || null;
    this.props.template = `<div class="inputText formElem${this.label ? '' : ' noLabel'}">
      <label class="inputTextInner inputInner" for="${this.id}">
        <span class="inputTextLabel inputLabel">${this.label}</span>
        <input class="input" type="text" value="${this.value}" id="${this.id}"
          ${this.maxlength ? `maxlength=${this.maxlength}` : ''}
        />
      </label>
    </div>`;
  }

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
          this.props.onChange(e, value);
        },
      });
    }
  };
}

export default InputText;
