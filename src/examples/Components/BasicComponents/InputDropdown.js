import { Component } from '../../../Lighter';

// Common props:
// - label: string/template (input field's label string)
// - value: string (input field's value)
// - options: (required) [
//     { value: any, text: string/number, disabled: boolean },
//     or grouped:
//     { label: string/number, group:
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
      // @TODO: Add warning
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

  _createOptions = () => {};
}

export default InputDropdown;
