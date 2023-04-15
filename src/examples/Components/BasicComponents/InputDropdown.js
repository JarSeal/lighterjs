import { Component } from '../../../Lighter';

// Common props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - options: array of objects (required) [
//     { value: any, text: string/number, disabled: boolean },
//     or grouped:
//     { label: string/number, group: array of objects
//       [
//         { value: any, text: string/number, disabled: boolean }
//       ]
//     }
//   ]
// - disabled: boolean (whether the input elem is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - focusOnFirstDraw = boolean (whether the input is focused after the first drawing or not, default false)
class InputDropdown extends Component {
  constructor(props) {
    super(props);
    this.label = props.label || '';
    this.value = props.value || '';
    this.options = props.options;
    if (!props.options?.length) {
      console.warn('options prop missing for id: ' + this.id);
      this.options = this.props.options = {};
    }
    this.focusOnFirstDraw = props.focusOnFirstDraw || false;
    this.changeHappened = false;
    this.props.template = `<div
      class="inputText inputDropdown formElem${this.label ? '' : ' noLabel'}"
    >
      <label class="inputInner" for="${this.id}">
        <span class="inputLabel">${this.label}</span>
        <select class="inputElem" id="${this.id}">
          ${this._createOptions()}
        </select>
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

  addListeners = () => {
    const inputElem = this.getInputElem();
    this.addListener({
      id: 'onchange',
      target: inputElem,
      type: 'change',
      fn: (e) => {
        const value = e.target.value;
        if (this.value === value) return;
        console.log('Changed');
        this.changeHappened = true;
        this.value = value;
        if (this.props.onChange) this.props.onChange(e, value, this);
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

  setValue = (newValue) => {
    this.value = newValue;
    this.props.value = newValue;
    const optionsTags = this.elem.querySelectorAll('option');
    for (let i = 0; i < optionsTags.length; i++) {
      optionsTags[i].removeAttribute('selected');
      if (String(newValue) === optionsTags[i].value) {
        optionsTags[i].setAttribute('selected', 'true');
      }
    }
  };

  _createOptions = () => {
    const { options } = this.props;
    let optionsStr = '';
    const addOption = (props) => {
      optionsStr += `<option
        ${props.disabled ? ' disabled' : ''}
        value="${props.value}"
        ${this.value === props.value ? ' selected' : ''}
      >${props.text}</option>`;
    };
    for (let i = 0; i < options.length; i++) {
      if (options[i].group) {
        optionsStr += `<optgroup label="${options[i].label}">`;
        for (let j = 0; j < options[i].group.length; j++) {
          addOption(options[i].group[j]);
        }
        optionsStr += '</optgroup>';
        continue;
      }
      addOption(options[i]);
    }
    return optionsStr;
  };
}

export default InputDropdown;
