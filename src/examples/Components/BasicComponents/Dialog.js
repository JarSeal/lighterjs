import { Component } from '../../../Lighter';

// props:
// - animTime: number[showTime, hideTime] (number of milliseconds for the bg and dialog to appear/hide, default [200, 200])
// - inlineStyles: boolean (whether to use basic inline CSS styles for dialog, background, showing, and hiding)
class Dialog extends Component {
  constructor(props) {
    super(props);
    this.defaultAnimTime = [400, 200];
    this.animTime = props.animTime || this.defaultAnimTime;
    this.inlineStyles = props.inlineStyles || false;
    this.dialogContent = null;
    this.dialogTitle = null;
    this.outsideClickEnabled = true;
    this.props.template = `<div class="dialogOuter"
      ${this.inlineStyles ? ` style="${this._outerStyles('hide')}"` : ''}
    >
      <div class="dialogBackground"
        ${this.inlineStyles ? ` style="${this._backgroundStyles}"` : ''}
      ></div>
      <div class="dialog" id="${this.id}-dialog"
        ${this.inlineStyles ? ` style="${this._dialogStyles}"` : ''}
      ></div>
    </div>`;
    dialogRefs[this.id] = this;
  }

  addListeners = () => {
    this.addListener({
      id: 'outside-click',
      target: this.elem.querySelector('.dialogBackground'),
      type: 'click',
      fn: () => {
        if (this.outsideClickEnabled) this.hide();
      },
    });
  };

  // dialogData:
  // - component: Component (the content to display)
  // - props?: object (Component props to use)
  // - title?: string (Dialog title)
  // - showCloseButton?: boolean (whether to show close button, default true)
  // - showCancelButton?: boolean (whether to show cancel button, default false)
  // - outsideClickEnabled?: boolean (whether the outside click is enabled or not, default true)
  show = (dialogData) => {
    if (dialogData.title) this.setTitle(dialogData.title);
    // @TODO: show close button
    // @TODO: show cancel button
    if (dialogData.outsideClickEnabled) this.outsideClickEnabled = dialogData.outsideClickEnabled;
    if (this.dialogContent?.isComponent) this.dialogContent.discard(true);
    this.dialogContent = new dialogData.component({
      ...(dialogData.props || {}),
      attachId: this.id + '-dialog',
    });
    console.log(this.dialogContent);
    this.dialogContent.draw();
    if (this.inlineStyles) this.elem.style.cssText = this._outerStyles('show');
    this.elem.classList.add('showing');
    this.elem.classList.add('show');
    setTimeout(() => {
      this.elem.classList.remove('showing');
    }, this.animTime[0]);
  };

  hide = () => {
    this.elem.classList.add('hiding');
    setTimeout(() => {
      this.elem.classList.remove('showing');
      this.elem.classList.remove('show');
      this.elem.classList.remove('hiding');
      if (this.inlineStyles) this.elem.style.cssText = this._outerStyles('hide');
      if (this.dialogTitle?.isComponent) this.dialogTitle.discard(true);
      if (this.dialogContent?.isComponent) this.dialogContent.discard(true);
      this.dialogTitle = null;
      this.dialogContent = null;
    }, this.animTime[1]);
    this.outsideClickEnabled = true;
  };

  setTitle = (title) => {
    if (this.dialogTitle?.isComponent) this.dialogTitle.discard(true);
    this.dialogTitle = new Component({
      attachId: this.id + '-dialog',
      text: title,
      tag: 'h2',
      class: 'dialogTitle',
    });
    this.dialogTitle.draw();
  };

  removeRef = () => {
    delete dialogRefs[this.id];
  };

  _outerStyles = (phase) => {
    const commonStyles =
      'overflow: hidden; position: fixed; z-index: 500; width: 100%; top: 0; left: 0;';
    if (phase === 'hide') return 'height: 0; ' + commonStyles;
    return 'height: 100%; ' + commonStyles;
  };
  _dialogStyles =
    'width: 96%; max-width: 640px; min-height: 240px; max-height: 98%; position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); background: #fff; padding: 14px;';
  _backgroundStyles = 'height: 100%; width: 100%; background: rgba(0,0,0,0.75);';
}

const dialogRefs = {};
export const useDialog = (id) => {
  const dialogIds = Object.keys(dialogRefs);
  if (!dialogIds.length) return;
  if (!id) return dialogRefs[dialogIds[0]];
  return dialogRefs[id];
};

export default Dialog;
