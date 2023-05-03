import { Component } from '../../../Lighter';

// Custom props:
// - icon/text: string/template or string (the click area of the ToolTip, text prop, if used, will override icon)
// - content: string/template (the ToolTip content)
// - width?: number (width of the ToolTip area)
// - horiAlign?: 'left', 'center', 'right' (should the box be aligned horisontally left, center, or right, default left)
// - vertAlign?: 'top', 'bottom' (should the box be aligned on top or bottom of the icon, default bottom)
// - addStylesToHead?: boolean (whether to add the basic CSS styles for the pointer and animations, default true)
class ToolTip extends Component {
  constructor(props) {
    super(props);
    if (props.addStylesToHead !== false) addStylesToHead();
    this._defineProps(props);
    this.toolTipOpen = false;
    this.props.template = `<div class="toolTip ${this.horiAlign} ${this.vertAlign}">
      <span class="toolTipIcon">${this.props.icon}</span>
      <div class="toolTipContent" style="width: ${this.width}px;">
        ${this.props.content || ''}
      </div>
    </div>`;
  }

  ignorePropChanges = () => ['template'];

  _defineProps = (props) => {
    if (props.text) {
      this.props.icon = this.props.text;
      this.props.text = null;
    }
    this.width = props.width || 160;
    if (props.horiAlign !== 'left' && props.horiAlign !== 'center' && props.horiAlign !== 'right') {
      props.horiAlign = 'left';
    }
    if (props.vertAlign !== 'top' && props.vertAlign !== 'bottom') {
      props.vertAlign = 'bottom';
    }
    this.horiAlign = props.horiAlign;
    this.vertAlign = props.vertAlign;
  };

  paint = (props) => {
    this._defineProps(props);
  };

  addListeners = () => {
    const target = this.elem.querySelector('.toolTipIcon');
    this.addListener({
      id: 'tooltip-icon-click',
      target,
      type: 'click',
      fn: (e) => {
        this.openToolTip();
        this.addListener({
          id: 'tooltip-outside-click',
          target: window,
          type: 'click',
          fn: (eOutside) => {
            if (eOutside.target === e.target) return;
            this.closeToolTip();
            this.removeListener('tooltip-outside-click');
          },
        });
      },
    });
  };

  openToolTip = () => {
    const toolTipElem = this.elem.querySelector('.toolTipContent');
    toolTipElem.style.display = 'block';
    this.toolTipOpen = true;
    setTimeout(() => {
      toolTipElem.classList.add('show');
      toolTipElem.style.removeProperty('display');
    }, 5);
  };

  closeToolTip = () => {
    const toolTipElem = this.elem.querySelector('.toolTipContent');
    toolTipElem.style.display = 'block';
    toolTipElem.classList.remove('show');
    this.toolTipOpen = false;
    setTimeout(() => {
      toolTipElem.style.removeProperty('display');
    }, 200);
  };
}

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = `
    .toolTip {
      display: inline-block;
      position: relative;
      cursor: pointer;
      box-sizing: border-box;
    }
    .toolTipContent {
      display: none;
      position: absolute;
      z-index: 200;
      background-color: #fff;
      padding: 8px 16px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      opacity: 0;
      border-radius: 4px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .toolTip.top .toolTipContent {
      bottom: 100%;
      margin-bottom: -8px;
      transition: margin-bottom 0.1s ease-in-out, opacity 0.1s ease-in-out;
    }
    .toolTip.top .toolTipContent.show {
      display: block;
      margin-bottom: 10px;
      opacity: 1;
    }
    .toolTip.bottom .toolTipContent {
      top: 100%;
      margin-top: -8px;
      transition: margin-top 0.1s ease-in-out, opacity 0.1s ease-in-out;
    }
    .toolTip.bottom .toolTipContent.show {
      display: block;
      margin-top: 10px;
      opacity: 1;
    }
    .toolTip.left .toolTipContent { left: 0; }
    .toolTip.right .toolTipContent { right: 0; }
    .toolTip.center .toolTipContent { left: 50%; transform: translateX(-50%); }

    .toolTipContent:before,
    .toolTipContent:after {
      display: block;
      content: "";
      width: 3px;
      height: 10px;
      background: transparent;
    }
    .toolTip.bottom .toolTipContent:before {
      border: 10px solid transparent;
      border-bottom-width: 10px;
      border-bottom-color: rgba(0, 0, 0, 0.2);
      position: absolute;
      bottom: 100%;
      margin-bottom: 1px;
    }
    .toolTip.top .toolTipContent:before {
      border: 10px solid transparent;
      border-top-width: 10px;
      border-top-color: rgba(0, 0, 0, 0.2);
      position: absolute;
      top: 100%;
      margin-top: 1px;
    }
    .toolTip.left .toolTipContent:before { left: 8px; }
    .toolTip.right .toolTipContent:before { right: 8px; }
    .toolTip.center .toolTipContent:before { left: 50%; margin-left: -10px; }
    .toolTipContent:after { width: 3px; }
    .toolTip.bottom .toolTipContent:after {
      border: 10px solid transparent;
      border-bottom-width: 10px;
      border-bottom-color: #fff;
      position: absolute;
      bottom: 100%;
    }
    .toolTip.top .toolTipContent:after {
      border: 10px solid transparent;
      border-top-width: 10px;
      border-top-color: #fff;
      position: absolute;
      top: 100%;
    }
    .toolTip.left .toolTipContent:after { left: 8px; }
    .toolTip.right .toolTipContent:after { right: 8px; }
    .toolTip.center .toolTipContent:after { left: 50%; margin-left: -10px; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default ToolTip;
