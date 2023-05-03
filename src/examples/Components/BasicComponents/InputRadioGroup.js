import { Component } from '../../../Lighter';

// props:
// - options: array of objects (required) [
//     { value: any, label: string/template, disabled: boolean },
//   ]
// - label: string/template (the groups main label)
// - value: string (selected radio button's value)
// - disabled: boolean (whether the whole fieldset is disabled or not)
// - onChange: function(event, this, option) (input field's on change listener callback)
// - onFocus: function(event, this, option) (input field's on focus listener callback)
// - onBlur: function(event, this, option) (input field's on blur listener callback)
// - noChangeListener: boolean (will not create an onChange listener)
// - noFocusListener: boolean (will not create an onFocus listener)
// - noBlurListener: boolean (will not create an onBlur listener)
// - autoFocus = boolean (whether the first radio input is focused after a draw or not, default false)
class InputRadioGroup extends Component {
  constructor(props) {
    super(props);
    this._defineProps(props);
    this.changeHappened = false;
    this.props.template = `<div class="inputRadioGroup formElem${this.label ? '' : ' noLabel'}">
      <fieldset class="inputRadioGroupFieldset">
        ${this.label ? `<legend class="inputRadioGroupLabel">${this.label}</legend>` : ''}
        <div
          class="inputRadioGroupOptions"
          id="${this.id}-options"
        >${this.createOptionsTemplates()}</div>
      </fieldset>
    </div>`;
  }

  _defineProps = (props) => {
    if (!props.options?.length) {
      console.error(`InputRadioGroup has to have an options prop, ID: ${this.id}`);
      throw new Error('Missing options prop');
    }
    this.options = props.options;
    this.label = props.label || null;
    this.value = props.value !== undefined ? props.value : null;
    this.disabled = props.disabled || false;
    this.onChange = props.onChange || null;
    this.onFocus = props.onFocus || null;
    this.onBlur = props.onBlur || null;
    this.autoFocus = props.autoFocus || false;
    this.noChangeListener = props.noChangeListener || false;
    this.noFocusListener = props.noFocusListener || false;
    this.noBlurListener = props.noBlurListener || false;
  };

  addListeners = () => {
    const inputElems = this.getInputElems();
    for (let i = 0; i < this.props.options.length; i++) {
      const option = this.props.options[i];
      if (!this.noChangeListener) {
        this.addListener({
          id: 'change-' + i,
          target: inputElems[i],
          type: 'change',
          fn: (e) => {
            if (this.value === e.target.value) return;
            this.value = e.target.value;
            this.props.value = this.value;
            this.changeHappened = true;
            if (this.props.onChange) this.props.onChange(e, this, option);
          },
        });
      }
      if (!this.noFocusListener) {
        this.addListener({
          id: 'focus-' + i,
          target: inputElems[i],
          type: 'focus',
          fn: (e) => {
            this.elem.classList.add('focus');
            if (this.props.onFocus) this.props.onFocus(e, this, option);
          },
        });
      }
      if (!this.noBlurListener) {
        this.addListener({
          id: 'blur-' + i,
          target: inputElems[i],
          type: 'blur',
          fn: (e) => {
            this.elem.classList.remove('focus');
            if (this.props.onBlur) this.props.onBlur(e, this, option);
          },
        });
      }
    }
  };

  paint = (props) => {
    this._defineProps(props);
    this.getFieldsetElem().disabled = this.disabled;
    this.disabled ? this.elem.classList.add('disabled') : this.elem.classList.remove('disabled');
    if (this.autoFocus && !this.noFocusListener && !this.noBlurListener) {
      this.elem.classList.add('focus');
      if (this.getInputElems()?.length) this.getInputElems()[0].focus();
    }
  };

  createOptionsTemplates = () => {
    let template = '';
    for (let i = 0; i < this.props.options.length; i++) {
      const option = this.props.options[i];
      template += `<label class="inputRadioGroupOptionWrapper" for="${this.id}-option-${i}">
        <input
          type="radio"
          value="${option.value}"
          name="${this.id}-option-group"
          id="${this.id}-option-${i}"
          class="inputRadioGroupOptionInput"
          ${option.value === this.props.value ? `checked="true"` : ''}
          ${option.disabled ? `disabled="${option.disabled}"` : ''}
        />
        <span class="inputRadioGroupOptionLabel">${option.label}</span>
      </label>`;
    }
    return template;
  };

  getInputElems = () => {
    this.inputElems = this.elem.querySelectorAll(
      '.inputRadioGroupOptions input.inputRadioGroupOptionInput'
    );
    return this.inputElems;
  };

  getFieldsetElem = () => {
    this.fieldsetElem = this.elem.querySelector('.inputRadioGroupFieldset');
    return this.fieldsetElem;
  };
}

export default InputRadioGroup;
