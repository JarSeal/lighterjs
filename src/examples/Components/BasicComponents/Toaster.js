import { Component, createUUID } from '../../../Lighter';

// props:
// - animTime?: number[showTime, hideTime] (number of milliseconds for the bg and dialog to appear/hide, default [400, 200])
// - position?: string[] (position of the Toaster [horisontal, vertical], default ['right', 'bottom'])
// - closeButtonTemplate?: string/template (close button string, template, or icon)
// - inlineStyles?: boolean (whether to use basic inline CSS styles for dialog, background, showing, and hiding)
class Toaster extends Component {
  constructor(props) {
    super(props);
    this.animTime = props.animTime || defaultAnimTime;
    this.position =
      Array.isArray(props.position) && props.position.length === 2
        ? props.position
        : ['right', 'bottom'];
    this.showTimer = null;
    this.closeButtonTemplate = props.closeButtonTemplate;
    this.inlineStyles = props.inlineStyles || true;
    this.props.style = { transitionDuration: this.animTime[0] + 'ms' };
    this.toasts = [];
    this.newToasts = [];
    // @TODO: add close all button template
    // this.closeAllButton = null;
    // this.closeAllButtonTemplate = props.closeAllButtonTemplate || 'x';
    this.addDocumentBodyClass = props.addDocumentBodyClass || true;
    this.props.template = `<div class="toasterOuter${this._createPositionClasses()}">
      <div class="toasterFactory" id="${this.id}-tfactory"></div>
    </div>`;
    if (this.inlineStyles) addStylesToHead();
    toasterRefs[this.id] = this;
  }

  ignorePropChanges = () => ['template'];

  // toast props:
  // - type?: string ('success', 'warning', 'error', 'info', default 'success')
  // - title?: string (toast's title text)
  // - content?: string (toast's content text)
  // - visibleTime?: number (toast's visible time in ms, 0 = infinite, defaults at the bottom)
  // - hasCloseButton?: boolean (whether to show the toast's close button or not, defaults at the bottom)
  show = (toast) => {
    const newToast = {
      type: 'success',
      id: createUUID(),
      ...defaultToastParams[toast.type || 'success'],
      ...toast,
    };
    this.newToasts.push(newToast);
    this._runFactory();
  };

  hide = (toast) => {
    toast.component.elem.classList.add('hiding');
    clearTimeout(toast.timer);
    setTimeout(() => {
      toast.component.discard(true);
      delete this.children[toast.id];
      this.toasts = this.toasts.filter((t) => t.id !== toast.id);
    }, this.animTime[1]);
  };

  _runFactory = () => {
    const newToastsLength = this.newToasts.length;
    if (!newToastsLength || this.showTimer) return;
    const newToast = this.newToasts[newToastsLength - 1];
    const newToastComponent = this.addDraw({
      id: newToast.id,
      attachId: this.id + '-tfactory',
      classes: ['preAppear', newToast.type],
      template: this._createToastTemplate(newToast),
      prepend: this.position[1] !== 'bottom',
      style: { transitionDuration: this.animTime[0] + 'ms' },
    });
    newToastComponent.addListener({
      id: 'closetoast',
      target: newToastComponent.elem.querySelector('.toasterToastClose'),
      type: 'click',
      fn: () => this.hide(newToast),
    });
    newToast.component = newToastComponent;
    setTimeout(() => {
      newToastComponent.elem.classList.remove('preAppear');
    }, 5);
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      this.toasts.push(newToast);
      this._setVisibilityTimer(newToast);
      this.newToasts = this.newToasts.filter((t) => t.id !== newToast.id);
      this._runFactory();
    }, this.animTime[0] + 6);
  };

  _setVisibilityTimer = (newToast) => {
    if (!newToast.visibleTime || newToast.visibleTime < 1) return;
    newToast.timer = setTimeout(() => this.hide(newToast), newToast.visibleTime || 0);
  };

  _createToastTemplate = (toast) => {
    const title = toast.title ? `<h4 class="toasterToastTitle">${toast.title}</h4>` : '';
    const closeBtn = this.closeButtonTemplate || '<button class="toasterToastClose">x</button>';
    const content = toast.content ? `<div class="toasterToastContent">${toast.content}</div>` : '';
    return `<div class="toasterToast">${title}${closeBtn}${content}</div>`;
  };

  removeRef = () => delete toasterRefs[this.id];

  _createPositionClasses = () => {
    let classes = '';
    switch (this.position[0]) {
      case 'left':
        classes = ' horiLeft';
        break;
      case 'center':
        classes = ' horiCenter';
        break;
      default:
        classes = ' horiRight';
    }
    switch (this.position[1]) {
      case 'top':
        classes += ' vertTop';
        break;
      case 'center':
        classes += ' vertCenter';
        break;
      default:
        classes += ' vertBottom';
    }
    return classes;
  };
}

export const defaultAnimTime = [200, 200];
export const defaultToastParams = {
  success: { visibleTime: 4400, hasCloseButton: true },
  warning: { visibleTime: 4400, hasCloseButton: true },
  error: { visibleTime: 0, hasCloseButton: true, title: 'Error' },
  info: { visibleTime: 0, hasCloseButton: true },
};

const toasterRefs = {};
export const useToaster = (id) => {
  const toasterIds = Object.keys(toasterRefs);
  if (!toasterIds.length) return;
  if (!id) return toasterRefs[toasterIds[0]];
  return toasterRefs[id];
};

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = `
    .toasterOuter {
      position: fixed;
      width: 260px;
      transition: padding-top ease-in, padding-bottom ease-in;
    }
    .toasterOuter.horiLeft { left: 0; }
    .toasterOuter.horiRight { right: 0; }
    .toasterOuter.horiCenter { left: 50%; transform: translateX(-50%); }
    .toasterOuter.vertTop { top: 0; }
    .toasterOuter.vertBottom { bottom: 0; }
    .toasterOuter.vertCenter { top: 50%; transform: translateY(-50%); }
    .toasterOuter.horiCenter.vertCenter { transform: translate3d(-50%, -50%, 0); }

    .toasterToast {
      position: relative;
      padding: 8px 16px 6px;
      background-color: #eaeaea;
      margin: 4px;
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .toasterToast.preAppear { transform: translateX(-100%); opacity: 0; transition: transform ease-out, opacity ease-out; }
    .horiRight .toasterToast.preAppear,
    .horiCenter .toasterToast.preAppear { transform: translateX(100%); }
    .toasterToast.hiding { opacity: 0; transform: translateY(50%); }
    .vertBottom .toasterToast.hiding { transform: translateY(-50%); }

    .toasterToastTitle {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      padding-right: 10px;
    }
    .toasterToastClose {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      padding: 0;
      line-height: 0;
      cursor: pointer;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default Toaster;
