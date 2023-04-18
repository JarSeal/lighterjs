import { Component } from '../../../Lighter';

// props:
// - animTime: number[showTime, hideTime] (number of milliseconds for the bg and dialog to appear/hide, default [400, 200])
// - inlineStyles: boolean (whether to use basic inline CSS styles for dialog, background, showing, and hiding)
// - windowConfirmMessage: string (window.confirm message when promptForLosingChanges is true)
// - closeButtonTemplate: string/template (close button string, template, or icon)
class Dialog extends Component {
  constructor(props) {
    super(props);
    this.defaultAnimTime = [400, 200];
    this.animTime = props.animTime || this.defaultAnimTime;
    this.inlineStyles = props.inlineStyles || false;
    this.closeButton = null;
    this.dialogTitle = null;
    this.dialogContent = null;
    this.outsideClickEnabled = true;
    this.hasChanges = false;
    this.title = null;
    this.hideCloseButton = false;
    this.promptOnClose = false;
    this.closeButtonTemplate = props.closeButtonTemplate || 'x';
    this.windowConfirmMessage =
      props.windowConfirmMessage ||
      'You have will lose the changes you made in the dialog. Are you sure?';
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

  // dialogData:
  // - component: Component (the content to display, required)
  // - props?: object (Component props to use)
  // - title?: string (Dialog title)
  // - @TODO: outerClasses?: [] (.dialogOuter extra classes)
  // - hideCloseButton?: boolean (whether to hide close button, default false)
  // - outsideClickEnabled?: boolean (whether the outside click is enabled or not, default true)
  // - promptOnClose?: boolean (whether the user is prompted for leaving the dialog with hasChanges = true, default false)
  // - @TODO: buttons?: array [ (the buttons to show at the bottom of the dialog, default no buttons)
  //   - { label: string/template, onClick: function(dialog), classes?: [] }
  //   ]
  // - @TODO: stickyButtons?: same as buttons but they will be rendered outside the .dialogContent
  show = (dialogData) => {
    if (!dialogData.component) {
      console.error('No component provided for the dialog to show.');
      return;
    }
    clearTimeout(this.afterAnimOut);
    this.addListener({
      id: 'outside-click',
      target: this.elem.querySelector('.dialogBackground'),
      type: 'click',
      fn: () => (this.outsideClickEnabled ? this.close() : null),
    });
    this.title = dialogData.title || null;
    this.hideCloseButton = dialogData.hideCloseButton || false;
    this.promptOnClose = dialogData.promptOnClose || false;
    this.outsideClickEnabled = dialogData.outsideClickEnabled !== false;
    if (this.dialogContent?.isComponent) this.dialogContent.discard(true);
    this.dialogContent = new Component({
      classes: ['dialogContent'],
      attachId: this.id + '-dialog',
    });
    this.dialogContent.draw();
    this.dialogContent.add(new dialogData.component({ ...(dialogData.props || {}) })).draw();
    if (this.title) this.setTitle(this.title);
    if (!this.hideCloseButton) this.createCloseButton();
    this.elem.querySelector('.dialogBackground').style.transitionDuration = this.animTime[0] + 'ms';
    this.elem.querySelector('.dialog').style.transitionDuration = this.animTime[0] + 'ms';
    if (this.inlineStyles) this.elem.style.cssText = this._outerStyles('show');
    this.elem.classList.add('showing');
    this.elem.classList.add('show');
    this.afterAnimIn = setTimeout(() => {
      this.elem.classList.remove('showing');
    }, this.animTime[0]);
  };

  close = () => {
    if (this.hasChanges && this.promptOnClose && !window.confirm(this.windowConfirmMessage)) {
      return;
    }
    clearTimeout(this.afterAnimIn);
    this.removeListener('outside-click');
    this.elem.querySelector('.dialogBackground').style.transitionDuration = this.animTime[1] + 'ms';
    this.elem.querySelector('.dialog').style.transitionDuration = this.animTime[1] + 'ms';
    this.elem.classList.remove('showing');
    this.elem.classList.add('hiding');
    this.hasChanges = false;
    this.title = null;
    this.hideCloseButton = false;
    this.promptOnClose = false;
    this.afterAnimOut = setTimeout(() => {
      this.elem.classList.remove('show');
      this.elem.classList.remove('hiding');
      if (this.inlineStyles) this.elem.style.cssText = this._outerStyles('hide');
      if (this.closeButton?.isComponent) this.closeButton.discard(true);
      if (this.dialogTitle?.isComponent) this.dialogTitle.discard(true);
      if (this.dialogContent?.isComponent) this.dialogContent.discard(true);
      this.closeButton = null;
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
      classes: ['dialogTitle'],
      prepend: true,
    });
    this.dialogTitle.draw();
  };

  createCloseButton = () => {
    if (this.closeButton?.isComponent) this.closeButton.discard(true);
    this.closeButton = new Component({
      attachId: this.id + '-dialog',
      classes: ['dialogCloseButton'],
      template: `<button>${this.closeButtonTemplate}</button>`,
      prepend: true,
    });
    this.closeButton.draw();
    this.closeButton.addListener({
      id: 'close-button-click',
      type: 'click',
      fn: () => this.close(),
    });
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
