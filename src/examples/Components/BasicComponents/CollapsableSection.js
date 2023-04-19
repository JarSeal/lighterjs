import { Component } from '../../../Lighter';

// props:
// - component?: Component (panel content that is toggled hidden/visible from the header)
// - props?: Component props (panel content component props)
// - title?: string/template (panel header title or template)
// - isOpen?: boolean (whether the content is visible at initiatation or not, default true)
// - afterToggle?: function(isOpen) (the callback after the section is toggled hidden/visible)
// - animTime?: number[showTime, hideTime] (the transition times for show/hide)
// - inlineStyles?: boolean (whether basic inline CSS styles are applied or not, default false)
class CollapsableSection extends Component {
  constructor(props) {
    super(props);
    this.content = props.content || '';
    this.componentProps = props.props || {};
    this.title = props.title || '';
    this.isOpen = props.isOpen || true;
    this.afterToggle = props.afterToggle || (() => {});
    this.animTime = props.animTime || defaultAnimTime;
    this.inlineStyles = props.inlineStyles || false;
    this.animShow = null;
    this.animHide = null;
    this.props.template = `<div class="collapsableSection${this.isOpen ? ' show' : ''}">
      <button class="collapsableSectionHeader">${this.title}</button>
      <div class="collapsableSectionContent">Content</div>
    </div>`;
  }

  addListeners = () => {
    this.addListener({
      id: 'header-click',
      target: this.elem.querySelector('.collapsableSectionHeader'),
      type: 'click',
      fn: () => this.toggleSection(),
    });
  };

  toggleSection = (isOpen) => {
    isOpen === undefined ? (this.isOpen = !this.isOpen) : (this.isOpen = isOpen);
    if (this.isOpen) {
      this._showSection();
      return;
    }
    this._hideSection();
  };

  _showSection = () => {
    this.elem.querySelector('.collapsableSectionContent').style.transitionDuration =
      this.animTime[0] + 'ms';
    // @TODO: set content height here
    clearTimeout(this.animHide);
    this.elem.classList.remove('hiding');
    this.elem.classList.add('showing');
    this.elem.classList.add('show');
    this.animShow = setTimeout(() => {
      // @TODO: remove content height here
      this.elem.classList.remove('showing');
    }, this.animTime[0]);
  };

  _hideSection = () => {
    this.elem.querySelector('.collapsableSectionContent').style.transitionDuration =
      this.animTime[0] + 'ms';
    // @TODO: set content height here
    clearTimeout(this.animShow);
    this.elem.classList.remove('showing');
    this.elem.classList.add('hiding');
    this.animHide = setTimeout(() => {
      this.elem.classList.remove('show');
      this.elem.classList.remove('hiding');
    }, this.animTime[0]);
  };

  updateContent = () => {};
}

export let defaultAnimTime = [2000, 2000];

export default CollapsableSection;
