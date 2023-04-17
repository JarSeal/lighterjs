import InputBase from './InputBase';

// props:
// - multiline = boolean (whether the input field is a textarea or input type=text/password, default false)
// - maxlength: number (input field's max length of characters)
// - password: boolean (whether the input elem's type is password or not, default false = type="text")

// InputBase props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - disabled: boolean (whether the input elem is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - noChangeListener: boolean (will not create an onChange listener)
// - noFocusListener: boolean (will not create an onFocus listener)
// - noBlurListener: boolean (will not create an onBlur listener)
// - focusOnFirstDraw = boolean (whether the input is focused after the first drawing or not, default false)
class InputText extends InputBase {
  constructor(props) {
    super(props);
    this.maxlength = props.maxlength || null;
    this.password = props.password || false;
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

  _createOnChangeListener = () => {
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
        if (this.props.onChange) this.props.onChange(e, value, this);
      },
    });
  };
}

export default InputText;
