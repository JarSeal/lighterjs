import InputBase from './InputBase';

// props:
// - options: array of objects (required) [
//     { value: any, text: string/number, disabled: boolean },
//     or grouped:
//     { label: string/number, group: array of objects
//       [
//         { value: any, text: string/number, disabled: boolean }
//       ]
//     }
//   ]

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
// - autoFocus = boolean (whether the input is focused after the first drawing or not, default false)
class InputDropdown extends InputBase {
  constructor(props) {
    super(props);
    this.options = props.options;
    if (!props.options?.length) {
      console.warn('options prop missing for id: ' + this.id);
      this.options = this.props.options = {};
    }
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

  _createOnChangeListener = () => {
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
