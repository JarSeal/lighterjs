import { Component } from '../../../Lighter';

// props:
// - animTime?: number[showTime, hideTime] (number of milliseconds for the bg and dialog to appear/hide, default [400, 200])
// - windowConfirmMessage?: string (window.confirm message when promptForLosingChanges is true)
// - closeButtonTemplate?: string/template (close button string, template, or icon)
// - addStylesToHead?: boolean (whether to use basic inline CSS styles for dialog, background, showing, and hiding, default true)
// - addDocumentBodyClass?: boolean (whether to add 'dialogOpen' class to document.body when the dialog is open, default true)
class Dialog extends Component {
  constructor(props) {
    super(props);
    this.animTime = props.animTime || defaultAnimTime;
    this.addStylesToHead = props.addStylesToHead === false ? false : true;
    this.contentMaxHeight = 400;
    this.closeButton = null;
    this.outerClasses = [];
    this.buttonComponents = [];
    this.buttons = [];
    this.stickyButtons = [];
    this.stickyComponent = null;
    this.dialogTitle = null;
    this.dialogContent = null;
    this.outsideClickEnabled = true;
    this.hasChanges = false;
    this.title = null;
    this.hideCloseButton = false;
    this.promptOnClose = false;
    this.dialogDisabled = false;
    this.closeButtonTemplate = props.closeButtonTemplate || 'x';
    this.addDocumentBodyClass = props.addDocumentBodyClass || true;
    this.windowConfirmMessage =
      props.windowConfirmMessage ||
      'You have will lose the changes you made in the dialog. Are you sure you want to close it?';
    this.props.template = `<div class="dialogOuter">
      <div class="dialogBackground"></div>
      <div class="dialog" id="${this.id}-dialog"></div>
    </div>`;
    if (this.addStylesToHead) addStylesToHead();
    dialogRefs[this.id] = this;
  }

  ignorePropChanges = () => ['template'];

  // dialogData:
  // - component?: Component (the Component to display, if not provided the base Component class is used)
  // - props?: object (Component props to use)
  // - title?: string (Dialog title)
  // - outerClasses?: [] (.dialogOuter extra classes)
  // - hideCloseButton?: boolean (whether to hide close button, default false)
  // - outsideClickEnabled?: boolean (whether the outside click is enabled or not, default true)
  // - promptOnClose?: boolean (whether the user is prompted for leaving the dialog with hasChanges = true, default false)
  // - buttons?: array [ (the buttons to show at the bottom of the dialog inside the .dialogContent, default no buttons)
  //   - { ...ComponentProps, onClick?: function(e, dialog) } (if onClick is not provided, a click will only close the dialog)
  //   ]
  // - stickyButtons?: same as buttons but they will be rendered outside the .dialogContent
  // - addDocumentBodyClass?: boolean (whether to add 'dialogOpen' class to document.body when the dialog is open, default true)
  show = (dialogData) => {
    this.dialogDisabled = true;
    if (!dialogData) dialogData = {};
    if (!dialogData.component) dialogData.component = Component;
    clearTimeout(this.afterAnimOut);

    // set possible document.body class
    if (dialogData.addDocumentBodyClass !== undefined) {
      this.addDocumentBodyClass = dialogData.addDocumentBodyClass;
    }
    if (this.addDocumentBodyClass) document.body.classList.add('dialogOpen');
    this.addDocumentBodyClass = this.props.addDocumentBodyClass || true;

    // set possible outer div classes
    const extraDialogClasses = this.props.classes ? ' ' + this.props.classes.join(' ') : '';
    this.elem.setAttribute('class', 'dialogOuter' + extraDialogClasses);
    if (dialogData.outerClasses?.length) this.outerClasses = dialogData.outerClasses;

    // set outside click listener
    this.addListener({
      id: 'outside-click',
      target: this.elem.querySelector('.dialogBackground'),
      type: 'click',
      fn: () => {
        // if (this.dialogDisabled) return;
        this.outsideClickEnabled ? this.close() : null;
      },
    });

    // set basic data from dialogData or default values
    this.title = dialogData.title || null;
    this.hideCloseButton = dialogData.hideCloseButton || false;
    this.promptOnClose = dialogData.promptOnClose || false;
    this.outsideClickEnabled = dialogData.outsideClickEnabled !== false;
    this.buttons = dialogData.buttons || [];
    this.stickyButtons = dialogData.stickyButtons || [];

    // create and draw component content components
    if (this.dialogContent?.isComponent) this.dialogContent.discard(true);
    this.dialogContent = new Component({
      classes: this.stickyButtons.length
        ? ['dialogContent', 'hasStickyButtons']
        : ['dialogContent'],
      attachId: this.id + '-dialog',
    });
    this.dialogContent.draw();
    this.dialogContent.addDraw(new dialogData.component({ ...(dialogData.props || {}) }));

    // create possible title and close button
    if (this.title) this.setTitle(this.title);
    if (!this.hideCloseButton) this._createCloseButton();

    // create possible basic buttons
    for (let i = 0; i < this.buttons.length; i++) {
      if (Array.isArray(this.buttons[i].classes)) {
        this.buttons[i].classes.push('dialogBasicButton');
      } else {
        this.buttons[i].classes = ['dialogBasicButton'];
      }
      const onClick = (e) => {
        this.buttons[i].onClick ? this.buttons[i].onClick(e, this) : this.close();
      };
      this._createButton({
        tag: 'button',
        ...this.buttons[i],
        id: 'dialog-button-' + i,
        attachId: this.id + '-dialog',
        onClick,
      });
    }
    // create possible stickyButtons
    const stickyAreaId = this.id + '-dialog-sticky-area';
    if (this.stickyButtons.length) {
      // create sticky area
      this.stickyComponent = new Component({
        _id: stickyAreaId,
        attachId: this.id + '-dialog',
        classes: ['dialogStickyButtons'],
      });
      this.stickyComponent.draw();
      for (let i = 0; i < this.stickyButtons.length; i++) {
        if (Array.isArray(this.stickyButtons[i].classes)) {
          this.stickyButtons[i].classes.push('dialogStickyButton');
        } else {
          this.stickyButtons[i].classes = ['dialogStickyButton'];
        }
        const onClick = (e) =>
          this.stickyButtons[i].onClick ? this.stickyButtons[i].onClick(e, this) : this.close();
        this._createButton({
          tag: 'button',
          ...this.stickyButtons[i],
          id: 'dialog-button-' + i,
          attachId: stickyAreaId,
          onClick,
        });
      }
    } else {
      this.elem.classList.remove('dialogStickyButtons');
    }

    // set possible extra outer classes
    for (let i = 0; i < this.outerClasses.length; i++) {
      this.elem.classList.add(this.outerClasses[i]);
    }

    // set inline CSS transition-duration values, and show/showing classes
    this.elem.querySelector('.dialogBackground').style.transitionDuration =
      Math.round(this.animTime[0] / 2) + 'ms';
    this.elem.querySelector('.dialog').style.transitionDuration = this.animTime[0] + 'ms';
    this.elem.classList.add('showing');
    this.elem.classList.add('show');
    this.afterAnimIn = setTimeout(() => {
      this.elem.classList.remove('showing');
      this.dialogDisabled = false;
    }, this.animTime[0]);
  };

  close = () => {
    if (this.hasChanges && this.promptOnClose && !window.confirm(this.windowConfirmMessage)) {
      return;
    }
    this.dialogDisabled = true;
    clearTimeout(this.afterAnimIn);
    this.removeListener('outside-click');
    this.elem.querySelector('.dialogBackground').style.transitionDuration =
      Math.round(this.animTime[1] / 2) + 'ms';
    this.elem.querySelector('.dialog').style.transitionDuration = this.animTime[1] + 'ms';
    this.elem.classList.remove('showing');
    this.elem.classList.add('hiding');
    this.hasChanges = false;
    this.title = null;
    this.hideCloseButton = false;
    this.promptOnClose = false;
    this.outerClasses = [];
    this.afterAnimOut = setTimeout(() => {
      this.elem.classList.remove('show');
      this.elem.classList.remove('hiding');
      this.elem.classList.remove('dialogStickyButtons');
      this._removeAllButtons();
      if (this.dialogTitle?.isComponent) this.dialogTitle.discard(true);
      if (this.dialogContent?.isComponent) this.dialogContent.discard(true);
      if (this.stickyComponent) this.stickyComponent.discard(true);
      this.closeButton = null;
      this.dialogTitle = null;
      this.dialogContent = null;
      this.buttonComponents = [];
      this.buttons = [];
      this.stickyButtons = [];
      const extraDialogClasses = this.props.classes ? ' ' + this.props.classes.join(' ') : '';
      this.elem.setAttribute('class', 'dialogOuter' + extraDialogClasses);
      document.body.classList.remove('dialogOpen');
      this.dialogDisabled = false;
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

  _createCloseButton = () => {
    this._createButton({
      id: 'close-button',
      attachId: this.id + '-dialog',
      template: `<button class="dialogCloseButton">${this.closeButtonTemplate}</button>`,
      prepend: true,
      onClick: () => this.close(),
    });
  };

  _createButton = (props) => {
    const foundButton = this.buttonComponents.find((btn) => btn.id === props.id);
    if (foundButton) foundButton.discard(true);
    const button = new Component(props);
    button.draw();
    button.addListener({
      id: props.id + '-click',
      type: 'click',
      fn: (e) => {
        if (this.dialogDisabled) return;
        props.onClick(e, this);
      },
    });
    this.buttonComponents.push(button);
  };

  _removeAllButtons = () => {
    const buttons = this.buttonComponents;
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].discard(true);
    }
  };

  removeRef = () => {
    delete dialogRefs[this.id];
  };
}

export const defaultAnimTime = [200, 200];

const dialogRefs = {};
export const useDialog = (id) => {
  const dialogIds = Object.keys(dialogRefs);
  if (!dialogIds.length) return;
  if (!id) return dialogRefs[dialogIds[0]];
  return dialogRefs[id];
};

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = `
    body.dialogOpen { overflow: hidden; }
    .dialogOuter { overflow: hidden; position: fixed; z-index: 500; width: 100%; top: 0; left: 0; height: 0; }
    .dialogOuter.show { height: 100%; }
    .dialogBackground { height: 100%; width: 100%; background: rgba(0,0,0,0); transition: background ease-in-out; }
    .dialogOuter.show .dialogBackground { background: rgba(0,0,0,0.75); }
    .dialogOuter.show.hiding .dialogBackground { background: rgba(0,0,0,0); }
    .dialogOuter .dialog { width: 96%; max-width: 640px; min-height: 240px; max-height: 98%; position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); background: #fff; margin-top: -50px; opacity: 0; transition: margin-top ease-out, opacity ease-out; }
    .dialogOuter.show .dialog { margin-top: 0; opacity: 1; }
    .dialogOuter.show.hiding .dialog { margin-top: -50px; opacity: 0; }

    .dialogTitle { margin: 16px 32px 16px 16px; }
    .dialogCloseButton { position: absolute; top: 0; right: 0; }
    .dialogOuter button { cursor: pointer; }
    .dialogContent { padding: 16px; overflow: auto; max-height: 60vh; }
    .dialogContent.hasStickyButtons { margin-bottom: 60px; }
    .dialogStickyButtons { max-height: 60px; position: absolute; left: 0; bottom: 0; padding: 16px; width: 100%; box-sizing: border-box; text-align: center; background-color: #fff; }
    .dialogStickyButtons button + button { margin-left: 16px; }
    .dialogBasicButton { margin: 16px 0 16px 16px; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default Dialog;
