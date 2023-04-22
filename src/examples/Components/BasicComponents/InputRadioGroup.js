import { Component } from '../../../Lighter';

// props:
// - options: array of objects (required) [
//     { value: any, text: string/number, disabled: boolean },
//   ]
// - label: string/template (the groups label text/template)
// - value: string (selected radio button's value)
// - disabled: boolean (whether the whole fieldset is disabled or not)
// - onChange: function(e, value, this) (input field's on change listener callback)
// - onFocus: function(event, value, this) (input field's on focus listener callback)
// - onBlur: function(event, value, this) (input field's on blur listener callback)
// - noChangeListener: boolean (will not create an onChange listener)
// - noFocusListener: boolean (will not create an onFocus listener)
// - noBlurListener: boolean (will not create an onBlur listener)
// - focusOnFirstDraw = boolean (whether the first radio input is focused after the first drawing or not, default false)
class InputRadioGroup extends Component {
  constructor(props) {
    super(props);
    if (!props.options?.length) {
      console.error(`InputRadioGroup has to have an options prop, ID: ${this.id}`);
      throw new Error('Missing options prop');
    }
    this.options = props.options;
    this.label = props.label || null;
    this.props.template = `<div class="inputRadioGroup formElem${this.label ? '' : ' noLabel'}">
      <fieldset class="inputRadioGroupFieldset">
        ${this.label ? `<legend class="inputRadioGroupLabel">${this.label}</legend>` : ''}
        <div class="inputRadioGroupOptions" id="${this.id}-options"></div>
      </fieldset>
    </div>`;
  }

  paint = () => {
    this.optionsComponent = this.addDraw(
      new Component({
        attachId: this.id + '-options',
        template: this._createOptionsTemplate(),
      })
    );
  };

  _createOptionsTemplate = () => {
    let template = '';
    console.log('OPTIONS', this.options);
    for (let i = 0; i < this.options.length; i++) {
      template += `<span>${this.options[i].label}</span>`;
    }
    return template;
  };

  getInputElems = () => {
    if (this.inputElems) return this.inputElems;
    this.inputElems = this.elem.querySelectorAll('.inputRadioGroupOptions input');
    return this.inputElems;
  };
}

export default InputRadioGroup;
