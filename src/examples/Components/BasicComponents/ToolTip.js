import { Component } from '../../../Lighter';

// Custom props:
// - icon: string/template (the click area of the ToolTip)
// - content: string/template (the ToolTip content)
// - width: number (width of the ToolTip area)
// - horiAlign: 'left', 'center', 'right' (should the box be aligned horisontally left, center, or right, default left)
// - vertAlign: 'top', 'bottom' (should the box be aligned on top or bottom of the icon, default bottom)
// - basicPopupStyles: boolean (whether the icon has basic inline CSS applied to it or not, default false)
class ToolTip extends Component {
  constructor(props) {
    super(props);
    if (props.text) {
      this.props.icon = this.props.text;
      this.props.text = null;
    }
    this.width = props.width || 120;
    if (props.horiAlign !== 'left' && props.horiAlign !== 'center' && props.horiAlign !== 'right') {
      props.horiAlign = 'left';
    }
    if (props.vertAlign !== 'top' && props.vertAlign !== 'bottom') {
      props.vertAlign = 'bottom';
    }
    this.horiAlign = props.horiAlign;
    this.vertAlign = props.vertAlign;
    this.toolTipOpen = false;
    this.props.template = `<div class="toolTip"${this._createParentRelativeStyle()}>
      <span class="toolTip-icon">${this.props.icon}</span>
      <div class="tooltip-content"${this._createBasicPopupStyles()}>
        ${this.props.content || ''}
      </div>
    </div>`;
  }

  addListeners = () => {
    const target = this.elem.querySelector('.tooltip-icon');
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
    const toolTipElem = this.elem.querySelector('.tooltip-content');
    if (this.props.basicPopupStyles) toolTipElem.style.display = 'block';
    toolTipElem.classList.add('show-tooltip');
    this.toolTipOpen = true;
  };

  closeToolTip = () => {
    const toolTipElem = this.elem.querySelector('.tooltip-content');
    if (this.props.basicPopupStyles) toolTipElem.style.display = 'none';
    toolTipElem.classList.remove('show-tooltip');
    this.toolTipOpen = false;
  };

  _createParentRelativeStyle = () => {
    if (!this.props.basicPopupStyles) return '';
    return ' style="display: inline-block; position: relative;"';
  };

  _createBasicPopupStyles = () => {
    if (!this.props.basicPopupStyles) return '';
    const styles = [
      'display: none;',
      'position: absolute;',
      'z-index: 200;',
      'background: #fff;',
      'padding: 4px;',
      'border-radius: 3px;',
      'border: 1px solid rgba(0,0,0,0.2);',
      'width: ' + this.width + 'px;',
      this.horiAlign === 'left' ? 'left: 0;' : '',
      this.horiAlign === 'right' ? 'right: 0;' : '',
      this.horiAlign === 'center' ? 'left: 50%;' : '',
      this.horiAlign === 'center' ? 'transform: translateX(-50%);' : '',
      this.vertAlign === 'top' ? 'bottom: 100%;' : '',
      this.vertAlign === 'bottom' ? 'top: 100%;' : '',
    ];
    return ` style="${styles.join('')}"`;
  };
}

export default ToolTip;
