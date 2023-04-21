import { Component } from '../../../Lighter';

// props:
// - contentComponent?: Component (panel content that is toggled hidden/visible from the header)
// - contentProps?: Component props (panel content component props)
// - title?: string/template (panel header title)
// - isOpen?: boolean (whether the content is visible at initiatation or not, default true)
// - beforeToggle?: function(this) (the callback before the section is toggled hidden/visible)
// - afterToggle?: function(this) (the callback after the section is toggled hidden/visible)
// - opensUp?: boolean (whether the section should open upwards or not, default false)
// - animTime?: number[showTime, hideTime] (the transition times for show/hide)
// - inlineStyles?: boolean (whether basic inline CSS styles are applied or not, default false)
class CollapsableSection extends Component {
  constructor(props) {
    super(props);
    this.contentComponent = props.contentComponent || null;
    this.contentProps = props.contentProps || {};
    this.content = null;
    this.title = props.title || '';
    this.isOpen = props.isOpen === false ? false : true;
    this.beforeToggle = props.beforeToggle || (() => {});
    this.afterToggle = props.afterToggle || (() => {});
    this.opensUp = props.opensUp || false;
    this.animTime = props.animTime || defaultAnimTime;
    this.inlineStyles = props.inlineStyles || defaultInlineStyles;
    this.animShow = null;
    this.animHide = null;
    this.contentAreaId = this.id + '-content-area';
    this.sectionTitle = null;
    this.props.template = `<div class="collapsableSection${this.isOpen ? ' show' : ''}">
      <div class="collapsableSectionContent" id="${this.contentAreaId}"></div>
    </div>`;
    addStylesToHead(this.inlineStyles);
  }

  paint = () => {
    this._createSectionTitle();
    if (this.isOpen) {
      this._createContent();
    }
  };

  _createSectionTitle = () => {
    if (this.sectionTitle) this.sectionTitle.discard(true);
    this.sectionTitle = this.addDraw({
      template: `<button class="collapsableSectionButton">${this.title}</button>`,
      prepend: !this.opensUp,
    });
    this.sectionTitle.addListener({
      id: 'header-click',
      type: 'click',
      fn: () => this.toggleSection(),
    });
  };

  updateTitle = (newTitle) => {
    this.title = newTitle;
    this._createSectionTitle();
  };

  toggleSection = (changeIsOpenTo) => {
    this.beforeToggle(this, changeIsOpenTo);
    changeIsOpenTo === undefined ? (this.isOpen = !this.isOpen) : (this.isOpen = changeIsOpenTo);
    if (this.isOpen) {
      this._showSection();
      return;
    }
    this._hideSection();
  };

  _showSection = () => {
    this._createContent();
    const contentElem = this.getContentElem();
    clearTimeout(this.animHide);
    this.elem.classList.remove('hiding');
    contentElem.style.transitionDuration = `${this.animTime[0]}ms`;
    let height = 0;
    if (this.inlineStyles) {
      contentElem.style.maxHeight = 'none';
      contentElem.style.position = 'fixed';
      contentElem.style.top = '-9999px';
      contentElem.style.overflow = 'hidden';
      height = contentElem.offsetHeight;
      contentElem.style.removeProperty('max-height');
      contentElem.style.removeProperty('position');
      contentElem.style.removeProperty('top');
      contentElem.style.removeProperty('overflow');
      setTimeout(() => (contentElem.style.maxHeight = height + 'px'), 0);
    }
    this.elem.classList.add('showing');
    this.animShow = setTimeout(() => {
      this.elem.classList.add('show');
      this.elem.classList.remove('showing');
      contentElem.style.removeProperty('transition-duration');
      if (this.inlineStyles) {
        contentElem.style.removeProperty('max-height');
      }
      this.afterToggle(this);
    }, this.animTime[0]);
  };

  _hideSection = () => {
    const contentElem = this.getContentElem();
    clearTimeout(this.animShow);
    contentElem.style.transitionDuration = this.animTime[1] + 'ms';
    const height = contentElem.offsetHeight;
    this.elem.classList.remove('showing');
    this.elem.classList.remove('show');
    contentElem.style.maxHeight = height + 'px';
    setTimeout(() => this.elem.classList.add('hiding'), 0);
    this.animHide = setTimeout(() => {
      contentElem.style.removeProperty('max-height');
      contentElem.style.removeProperty('transition-duration');
      this.elem.classList.remove('hiding');
      if (this.content?.isComponent) this.content.discard(true);
      this.afterToggle(this);
    }, this.animTime[1]);
  };

  _createContent = () => {
    const props = { ...this.contentProps, attachId: this.contentAreaId };
    if (this.content?.isComponent) this.content.discard(true);
    this.content = this.add(
      this.contentComponent ? new this.contentComponent(props) : props
    ).draw();
  };

  getContentElem = () => this.elem.querySelector('.collapsableSectionContent');

  updateContent = () => {};
}

export let defaultAnimTime = [200, 200];
export let defaultInlineStyles = false;
let stylesAdded = false;
export const addStylesToHead = (inlineStyles) => {
  if (stylesAdded || !inlineStyles) return;
  const css = `
    .collapsableSection .collapsableSectionContent {
      transition: max-height ease-in-out;
      max-height: 0;
      overflow: hidden;
    }
    .collapsableSection.show .collapsableSectionContent {
      overflow: auto;
      max-height: none;
    }
    .collapsableSection.showing .collapsableSectionContent {
      overflow: hidden;
    }
    .collapsableSection.hiding .collapsableSectionContent {
      max-height: 0 !important;
      overflow: hidden;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default CollapsableSection;
