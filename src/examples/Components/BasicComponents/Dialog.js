import { Component } from '../../../Lighter';

// props:
// - animTime?: number[showTime, hideTime] (number of milliseconds for the bg and dialog to appear/hide, default [400, 200])
// - windowConfirmMessage?: string (window.confirm message when promptForLosingChanges is true)
// - closeButtonTemplate?: string/template (close button string, template, or icon)
// - inlineStyles?: boolean (whether to use basic inline CSS styles for dialog, background, showing, and hiding)
// - basePadding?: string (base padding to be used with inlineStyles, default '14px')
// - addDocumentBodyClass?: boolean (whether to add 'dialogOpen' class to document.body when the dialog is open, default true)
class Dialog extends Component {
  constructor(props) {
    super(props);
    this.defaultAnimTime = [400, 200];
    this.animTime = props.animTime || this.defaultAnimTime;
    this.inlineStyles = props.inlineStyles || false;
    this.basePadding = props.basePadding || '14px';
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
    this.closeButtonTemplate = props.closeButtonTemplate || 'x';
    this.addDocumentBodyClass = props.addDocumentBodyClass || true;
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
  // - component?: Component (the Component to display, if not provided the base Component is used)
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

    // set possible outside click listener
    this.addListener({
      id: 'outside-click',
      target: this.elem.querySelector('.dialogBackground'),
      type: 'click',
      fn: () => (this.outsideClickEnabled ? this.close() : null),
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
      classes: ['dialogContent'],
      attachId: this.id + '-dialog',
      style: this.inlineStyles
        ? { padding: this.basePadding, overflow: 'auto', maxHeight: '60vh' }
        : null,
    });
    this.dialogContent.draw();
    this.dialogContent.add(new dialogData.component({ ...(dialogData.props || {}) })).draw();

    // create possible title and close button
    if (this.title) this.setTitle(this.title);
    if (!this.hideCloseButton) this._createCloseButton();

    // create possible buttons
    for (let i = 0; i < this.buttons.length; i++) {
      const onClick = this.buttons[i].onClick || (() => this.close());
      this._createButton({
        tag: 'button',
        ...this.buttons[i],
        id: 'dialog-button-' + i,
        attachId: this.id + '-dialog',
        style: this.inlineStyles ? { margin: this.basePadding } : null,
        onClick,
      });
    }
    // create possible stickyButtons
    const stickyAreaId = this.id + '-dialog-sticky-area';
    if (this.stickyButtons.length) {
      // create sticky area
      const style = this.inlineStyles
        ? {
            position: 'absolute',
            left: 0,
            bottom: 0,
            padding: this.basePadding,
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
          }
        : null;
      this.stickyComponent = new Component({
        _id: stickyAreaId,
        attachId: this.id + '-dialog',
        style,
      });
      this.stickyComponent.draw();
      this.elem.classList.add('dialogStickyButtons');
      for (let i = 0; i < this.stickyButtons.length; i++) {
        const onClick = this.stickyButtons[i].onClick || (() => this.close());
        this._createButton({
          tag: 'button',
          ...this.stickyButtons[i],
          id: 'dialog-button-' + i,
          attachId: stickyAreaId,
          style: this.inlineStyles ? { margin: '0 ' + this.basePadding } : null,
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

    // set inline CSS transition-duration values, show(ing), and possible inline styles
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
    this.outerClasses = [];
    this.afterAnimOut = setTimeout(() => {
      this.elem.classList.remove('show');
      this.elem.classList.remove('hiding');
      this.elem.classList.remove('dialogStickyButtons');
      if (this.inlineStyles) this.elem.style.cssText = this._outerStyles('hide');
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
      style: this.inlineStyles ? { margin: this.basePadding } : null,
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
      style: this.inlineStyles ? { position: 'absolute', top: 0, right: 0 } : null,
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
      fn: (e) => props.onClick(e, this),
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

  _outerStyles = (phase) => {
    const commonStyles =
      'overflow: hidden; position: fixed; z-index: 500; width: 100%; top: 0; left: 0;';
    if (phase === 'hide') return 'height: 0; ' + commonStyles;
    return 'height: 100%; ' + commonStyles;
  };
  _dialogStyles =
    'width: 96%; max-width: 640px; min-height: 240px; max-height: 98%; position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); background: #fff;';
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
