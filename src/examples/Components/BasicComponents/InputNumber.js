import InputBase from './InputBase';

// props:
// - numberSeparators?: object { (defaults can be set at app initialisation)
//   - decimal: string (',' or '.', default ',')
//   - thousand: string (default '')
//   }
// - step?: number (the step that the number is increased/decreased with the control buttons or keys, default 1)
// - precision?: number (the decimal precision that number is presented, default 0 aka whole numbers)
// - roundingFn?: function(value) (the rounding function to perform the rounding for precision, eg. Math.floor)
// @TODO: - allowExponents?: boolean (whether the input accepts exponential representation, eg. 3e12 or 3e+12, default true)
// @TODO: - min?: number (the minimum range value)
// @TODO: - max?: number (the maximum range value)
// @TODO: - useCustomButtons?: boolean (whether to use custom buttons for the up and down)
// @TODO: - canBeNull? boolean (whether the value can be null or empty, default false)
// - onEnterKey?: - function(event, value, this) (input field's callback when 'Enter' key is pressed while in focus)

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
        />
      </label>
      <div class="inputErrorMsg"></div>
    </div>`;
  }

  ignorePropChanges = () => ['template'];

  _defineProps = (props) => {
    this._validateSeparators();
    this.value = parseStringValueToNumber(props.value) || 0;
    this.numberSeparators = { ...numberSeparators, ...(props.numberSeparators || {}) };
    this.step = props.step || 1;
    this.precision = props.precision ? props.precision : 0;
    this.roundingFn = props.roundingFn || Math.round;
    this.getInputElem().setAttribute('step', this.step);
    this.setValue(this.value);
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

  setValue = (value) => {
    let rounder = 1,
      roundedValue = 0;
    const parsedValue = parseStringValueToNumber(value);
    if (this.precision === 0) {
      roundedValue = this.roundingFn(parsedValue);
    } else {
      rounder = Math.pow(10, this.precision);
      roundedValue = this.roundingFn(parsedValue * rounder) / rounder;
    }
    this.value = roundedValue;
    const inputElem = this.getInputElem();
    const elemValue = this.precision ? roundedValue.toFixed(this.precision) : roundedValue;
    inputElem.value = elemValue;
    inputElem.setAttribute('value', elemValue); // This is needed because the step function is calculated from the attribute value, not inputElem.value
  };

  _onChangeFn = (e) => {
    const value = parseStringValueToNumber(e.target.value);
    if (this.value === value) return;
    this.changeHappened = true;
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

  _onBlurFn = (_, value) => this.setValue(value);

  _createOnEnterKeyListener = () => {
    const inputElem = this.getInputElem();
    this.addListener({
      id: 'onenterkey',
      target: inputElem,
      type: 'keyup',
      fn: (e) => {
        const key = e.code;
        if (key === 'Enter') {
          inputElem.blur();
          if (this.props.onEnterKey) this.props.onEnterKey(e, e.target.value, this);
        }
      },
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
