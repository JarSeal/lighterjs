import { v4 as uuidv4 } from 'uuid';

// Local Storage
class LocalStorage {
  constructor(keyPrefix) {
    this.keyPrefix = keyPrefix || '';
    this.localStorageAvailable = this._lsTest();
  }

  getItem(key, defaultValue) {
    // defaultValue is returned (if provided) if local storage is not available or the key is not found
    if (!this.localStorageAvailable) return defaultValue || null;
    if (this.checkIfItemExists(key)) {
      return localStorage.getItem(this.keyPrefix + key);
    } else {
      return defaultValue || null;
    }
  }

  checkIfItemExists(key) {
    if (!this.localStorageAvailable) return false;
    return Object.prototype.hasOwnProperty.call(localStorage, this.keyPrefix + key);
  }

  setItem(key, value) {
    if (!this.localStorageAvailable) return false;
    localStorage.setItem(this.keyPrefix + key, value);
    return true;
  }

  removeItem(key) {
    if (!this.localStorageAvailable) return false;
    if (this.checkIfItemExists(key)) {
      localStorage.removeItem(this.keyPrefix + key);
    }
    return true;
  }

  convertValue(defaultValue, lsValue) {
    if (typeof defaultValue === 'boolean') {
      return lsValue === 'true';
    } else if (typeof defaultValue === 'number') {
      return Number(lsValue);
    } else {
      // typeof string
      return lsValue;
    }
  }

  _lsTest() {
    const test = this.keyPrefix + 'testLSAvailability';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Session Storage
class SessionStorage {
  constructor(keyPrefix) {
    this.keyPrefix = keyPrefix || '';
    this.sessionStorageAvailable = this._lsTest();
  }

  getItem(key, defaultValue) {
    // defaultValue is returned (if provided) if session storage is not available or the key is not found
    if (!this.sessionStorageAvailable) return defaultValue || null;
    if (this.checkIfItemExists(key)) {
      return sessionStorage.getItem(this.keyPrefix + key);
    } else {
      return defaultValue || null;
    }
  }

  checkIfItemExists(key) {
    if (!this.sessionStorageAvailable) return false;
    return Object.prototype.hasOwnProperty.call(sessionStorage, this.keyPrefix + key);
  }

  setItem(key, value) {
    if (!this.sessionStorageAvailable) return false;
    sessionStorage.setItem(this.keyPrefix + key, value);
    return true;
  }

  removeItem(key) {
    if (!this.sessionStorageAvailable) return false;
    if (this.checkIfItemExists(key)) {
      sessionStorage.removeItem(this.keyPrefix + key);
    }
    return true;
  }

  convertValue(defaultValue, lsValue) {
    if (typeof defaultValue === 'boolean') {
      return lsValue === 'true';
    } else if (typeof defaultValue === 'number') {
      return Number(lsValue);
    } else {
      // typeof string
      return lsValue;
    }
  }

  _lsTest() {
    const test = this.keyPrefix + 'testSSAvailability';
    try {
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Logger
// The callback returns the type ('log', 'error', 'warning') and the arguments
class Logger {
  constructor(prefix, callback, quiet) {
    this.prefix = prefix || '';
    this.callback = callback;
    this.showLogs = true;
    this.showErrors = true;
    this.showWarnings = true;
    if (quiet) this.turnOff();
  }

  setCallback = (callback) => (this.callback = callback);

  log(...args) {
    if (this.callback) this.callback('log', ...args);
    if (!this.showLogs) return;
    console.log(this.prefix, ...args);
  }

  error(...args) {
    if (this.callback) this.callback('error', ...args);
    if (!this.showErrors) return;
    console.error(this.prefix, ...args);
  }

  warn(...args) {
    if (this.callback) this.callback('warning', ...args);
    if (!this.showWarnings) return;
    console.warn(this.prefix, ...args);
  }

  turnOff() {
    this.showLogs = false;
    this.showErrors = false;
    this.showWarnings = false;
  }

  turnOn() {
    this.showLogs = true;
    this.showErrors = true;
    this.showWarnings = true;
  }
}

const createUUID = () => uuidv4();

const configs = {
  numberSeparators: {
    decimal: ',',
    thousand: ' ',
  },
};
const setConfig = (key, value) => (configs[key] = value);
const getConfig = (key) => configs[key];
const removeConfig = (key) => delete configs[key];

const parseStringValueToNumber = (string, seps) => {
  let separators = configs.numberSeparators;
  if (!seps?.decimal || !seps?.thousand)
    separators = { ...configs.numberSeparators, ...(seps || {}) };
  return Number(
    String(string).replace(separators.decimal, '.').replaceAll(separators.thousand, '')
  );
};

const parseNumberValueToString = (value, seps) => {
  if (isNaN(Number(value))) {
    console.warn(`parseNumberValueToString: value "${value}" is not a number (NaN).`);
    return NaN;
  }
  let separators = configs.numberSeparators;
  if (!seps?.decimal || !seps?.thousand)
    separators = { ...configs.numberSeparators, ...(seps || {}) };

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

export {
  LocalStorage,
  SessionStorage,
  Logger,
  createUUID,
  parseStringValueToNumber,
  parseNumberValueToString,
  setConfig,
  getConfig,
  removeConfig,
};
