import { v4 as uuidv4 } from 'uuid';

import { RouterRef } from './Router';
import { Logger } from './utils';

const components = {};
const logger = new Logger('LIGHTER.js COMPO *****');

class Component {
  constructor(props) {
    // props (optional) = {
    //   id: string (if not given an 'id' or '_id', an UUID is created for the component)
    //   _id: string (same as 'id' but will also place the 'id' attribute to the element as well)
    //   template: string (HTML template of the component)
    //   attachId: string (id of the component that this component will be attached to in the DOM, if not set the parent elem will be the target, which is set in the add function)
    //   text: string (text node to render in the element)
    //   classes: string[] (array of strings to be added as the elements CSS classes)
    //   attributes: {
    //     key: value (the key and value pairs will be added as the element's HTML attributes, eg. <li key="value"><li>)
    //   }
    //   style: {
    //     cssProperty: "value" (the key and value pairs will be added as the element's inline styles, eg. <li style="color: red;"><li>)
    //   }
    // }
    if (props?.parent || props?.children) {
      logger.error(
        `Component props contains a reserved keyword (parent or children. Props: ${JSON.stringify(
          props
        )}`
      );
      throw new Error('Invalid Component props key.');
    }
    if (props?.id || props?._id) {
      this.id = props.id || props._id;
    } else {
      this.id = uuidv4();
    }
    this.props = {
      id: this.id,
      ...props,
    };
    components[this.id] = this;
    this.elem;
    this.parent;
    this.template;
    this.children = {};
    this.listeners = {};
    this.listenersToAdd = [];
    this.drawing = false;
    this.discarding = false;
    this.isComponent = true;
    if (this.props.attachId) {
      if (this.parent) {
        this.parent.elem = this.getComponentElemById(this.props.attachId);
      } else {
        this.parent = { elem: this.getComponentElemById(this.props.attachId) };
      }
    }
    this.router = RouterRef;
  }

  paint() {}
  addListeners() {}

  draw = (newProps) => {
    if (this.drawing || this.discarding) return;
    this.drawing = true;
    const props = { ...this.props, ...newProps };
    this.props = props;
    if (this.elem) this.discard();
    if (!this.template !== props.template) {
      this.template = props.template || this._createDefaultTemplate(props);
    }
    const template = document.createElement('template');
    template.innerHTML = this.template;
    this.elem = template.content.firstChild;
    props.prepend ? this.parent.elem.prepend(this.elem) : this.parent.elem.append(this.elem);
    this._setElemData(this.elem, props);
    this.paint(props);
    this.addListeners(props);
    for (let i = 0; i < this.listenersToAdd.length; i++) {
      if (this.listenersToAdd[i].targetId) {
        this.listenersToAdd[i].target = this.getComponentElemById(this.listenersToAdd[i].targetId);
      }
      this.addListener(this.listenersToAdd[i]);
    }
    this.listenersToAdd = [];
    this.drawing = false;
    return this;
  };

  add = (componentOrProps) => {
    let component = componentOrProps;
    if (!component.isComponent) component = new Component(componentOrProps);
    this.children[component.id] = component;
    if (!component.props.attachId) component.parent = this;
    return component;
  };

  addListener = (listener) => {
    let { id, target, type, fn } = listener;
    if (!type || !fn) {
      logger.error(
        `Could not add listener, type, and/or fn missing. Listener props: ${JSON.stringify(
          listener
        )}`,
        this
      );
      throw new Error('Call stack');
    }
    if (!id) {
      id = this.id;
      listener.id = id;
    }
    if (!target) {
      target = this.elem;
      if (target === null) {
        logger.error(
          `Could not add listener, target elem was given but is null. Listener props: ${JSON.stringify(
            listener
          )}`,
          this
        );
        throw new Error('Call stack');
      }
      listener.target = target;
    }
    if (this.listeners[id]) this.removeListener(id);
    if (!target) return;
    target.addEventListener(type, fn);
    this.listeners[id] = listener;
  };

  removeListener = (id) => {
    if (!id) {
      logger.error(
        `Could not remove listener, id missing. Listener props: ${JSON.stringify(id)}`,
        this
      );
      throw new Error('Call stack');
    }
    const { target, type, fn } = this.listeners[id];
    target.removeEventListener(type, fn);
    delete this.listeners[id];
  };

  discard = (fullDiscard) => {
    if (this.discarding) return;
    this.discarding = true;
    // Remove listeners
    let keys = Object.keys(this.listeners);
    for (let i = 0; i < keys.length; i++) {
      this.removeListener(keys[i]);
    }
    // Discard children
    keys = Object.keys(this.children);
    for (let i = 0; i < keys.length; i++) {
      this.children[keys[i]].discard(fullDiscard);
      if (fullDiscard) delete this.children[keys[i]];
    }
    // Remove element from DOM
    if (this.elem) {
      this.elem.remove();
      this.elem = null;
    }
    if (fullDiscard) delete components[this.id];
    this.discarding = false;
  };

  _setElemData = (elem, props) => {
    if (!elem || !props) return;
    if (props.classes?.length) {
      elem.classList.add(...props.classes);
    }
    if (props.attributes) {
      const keys = Object.keys(props.attributes);
      for (let i = 0; i < keys.length; i++) {
        elem.setAttribute(keys[i], props.attributes[keys[i]]);
      }
    }
    if (props.style) {
      const keys = Object.keys(props.style);
      for (let i = 0; i < keys.length; i++) {
        elem.style[keys[i]] = props.style[keys[i]];
      }
    }
    if (props.text) elem.innerText = props.text;
  };

  _createDefaultTemplate = (props) => {
    let idString = '';
    if (props._id) idString = ` id="${props.id}"`;
    if (props?.tag) {
      return `<${props.tag}${idString}></${props.tag}>`;
    } else {
      return `<div${idString}></div>`; // Default
    }
  };

  getComponentById = (id) => components[id];
  getComponentElemById = (id) => {
    const component = components[id];
    if (!component?.elem) return document.getElementById(id);
    return component.elem;
  };
}

export const setLoggerCallback = (callback) => logger.setCallback(callback);
export const isLoggerQuiet = (isQuiet) => (isQuiet ? logger.turnOff() : logger.turnOn());

export default Component;