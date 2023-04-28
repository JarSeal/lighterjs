import InputBase from './InputBase';

// props:
// - maxlength: number (input field's max length of characters)
// - numberSeparators?: object { (defaults can be set at app initialisation)
//   - decimal: string (',' or '.', default ',')
//   - thousand: string (default '')
//   }
// @TODO: - step?: number (the step that the number is increased/decreased with the control buttons or keys, default 1)
// @TODO: - precision?: number (the decimal precision that number is presented, default 0 aka whole numbers)
// @TODO: - allowExponents?: boolean (whether the input accepts exponential representation, eg. 3e12, default true)
// @TODO: - min?: number (the minimum range value)
// @TODO: - max?: number (the maximum range value)

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
// - autoFocus = boolean (whether the input is focused after a draw or not, default false)
// - selectTextOnFocus?: (whether to select text on focus, only applies to InputText and InputNumber, default false)
class InputNumber extends InputBase {
  constructor(props) {
    super(props);
    this.numberSeparators = { ...numberSeparators, ...(props.numberSeparators || {}) };
    this.props.template = `<div
      class="inputText inputNumber formElem${props.label ? '' : ' noLabel'}"
    >
      <label class="inputInner" for="${this.id}">
        <span class="inputLabel">${props.label}</span>
        <input class="inputElem" type="number"
          value="${parseStringValueToNumber(props.value, this.numberSeparators)}" id="${this.id}"
          ${props.maxlength ? `maxlength=${props.maxlength}` : ''}
        />
      </label>
      <div class="inputErrorMsg"></div>
    </div>`;
  }

  ignorePropChanges = () => ['template'];

  _defineProps = (props) => {
    this.value = parseStringValueToNumber(props.value) || 0;
    this.maxlength = props.maxlength || null;
    this.numberSeparators = { ...numberSeparators, ...(props.numberSeparators || {}) };
  };

  _validateSeparators = () => {
    if (this.numberSeparators.decimal === this.numberSeparators.thousand) {
      console.error(
        'The decimal and thousand separator cannot be the same, component ID: ',
        this.id
      );
      throw new Error('Decimal and thousand separator are the same.');
    }
  };

  paint = (props) => {
    this._defineProps(props);
  };

  _onChangeFn = (e) => {
    const value = parseStringValueToNumber(e.target.value);
    if (this.value === value) return;
    this.changeHappened = true;
    this.value = value;
    console.log('VLAUE', value);
    if (this.props.onChange) this.props.onChange(e, value, this);
  };

  _createOnChangeListener = () => {
    const inputElem = this.getInputElem();
    this.addListener({
      id: 'onchange',
      target: inputElem,
      type: 'keyup',
      fn: this._onChangeFn,
    });
    this.addListener({
      id: 'onupdownchange',
      target: inputElem,
      type: 'change',
      fn: this._onChangeFn,
    });
  };
}

// @CONSIDER: move this to LighterJS getConfig utils file (also make a setConfig)
export const numberSeparators = {
  decimal: ',',
  thousand: ' ',
};

// @CONSIDER: move this to the LighterJs utils file
export const parseStringValueToNumber = (string, seps) => {
  let separators = numberSeparators;
  if (!seps?.decimal || !seps?.thousand) separators = { ...numberSeparators, ...(seps || {}) };
  return Number(
    String(string).replace(separators.decimal, '.').replaceAll(separators.thousand, '')
  );
};

// @CONSIDER: move this to the LighterJs utils file
export const parseNumberValueToString = (value, seps) => {
  if (isNaN(Number(value))) {
    console.warn(`parseNumberValueToString: value "${value}" is not a number (NaN).`);
    return NaN;
  }
  let separators = numberSeparators;
  if (!seps?.decimal || !seps?.thousand) separators = { ...numberSeparators, ...(seps || {}) };

  // this forces to use either one ',' or '.' and makes ',' the default
  const decimalSeparatorReplace = separators.decimal === '.' ? '.' : ',';
  const decimalSeparatorSearch = decimalSeparatorReplace === '.' ? ',' : '.';
  let stringValue = String(value).replace(decimalSeparatorSearch, decimalSeparatorReplace);
  if (separators.thousand) {
    const splitValue = stringValue.split(decimalSeparatorReplace);
    const thousandSeparatedValue = splitValue[0].replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      '$1' + separators.thousand
    );
    stringValue =
      thousandSeparatedValue + (splitValue[1] ? decimalSeparatorReplace + splitValue[1] : '');
  }
  return stringValue;
};

export default InputNumber;
