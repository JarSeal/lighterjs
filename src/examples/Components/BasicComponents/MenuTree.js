import { Component } from '../../../Lighter';

// props:
// - tree: [
//   {
//     - label: string/template (text or html to display on the menu item)
//     - link?: string (link string, if also the onClick is defined, the link is called after the onClick)
//     - linkTarget?: string (link target attribute)
//     - routeLink?: string (same as link, but it doesn't force a page refresh, requires router to be set up)
//     - onClick?: function(e, treeItem) (function for the item click)
//     - disabled?: boolean (whether the item and its children are disabled or not, default false)
//     - labelTag?: string (tag of the label, default 'span' but if link is defined, then it is 'a', and if onClick then it is 'button')
//     - tree?: array of objects (same as the parent tree)
//   }
// ]
// - disabled?: boolean (whether the whole menu tree is disabled or not, default false)
// - inlineStyles?: boolean (whether basic inline CSS styles are applied or not, default false)
// - forceUpdateRouteLinks?: boolean (whether to use forceUpdate for routeLinks or not, default true)
class MenuTree extends Component {
  constructor(props) {
    super(props);
    this.props.template = `<div class="menuTree menuTreeOuter"></div>`;
  }

  _defineProps = (props) => {
    if (!props.tree?.length) {
      console.error(`Menu tree has to have a tree prop, ID: ${this.id}`);
      throw new Error('Missing tree prop');
    }
    this.tree = props.tree;
    this.disabled = props.disabled || false;
    this.inlineStyles = props.inlinestyles || false;
    this.forceUpdateRouteLinks = props.forceUpdateRouteLinks === false ? false : true;
    if (this.treeComponent?.idComponent) this.treeComponent.discard(true);
  };

  paint = (props) => {
    this._defineProps(props);
    const template = this._createTreeTemplate(this.tree);
    this.treeComponent = this.addDraw({ template });
    this.treeComponent.addListener({
      id: 'tree-click',
      type: 'click',
      fn: this._treeOnClick,
    });
  };

  _createTreeTemplate = (tree, prevIdPrefix) => {
    let idPrefix = prevIdPrefix || '';
    let template = '<ul class="menuTreeGroup">';
    for (let i = 0; i < tree.length; i++) {
      const treePos = idPrefix ? idPrefix + ', ' + i : i;
      const tag = this._getLabelTag(tree[i]);
      let href = tag === 'a' ? ` href="${tree[i].link}"` : '';
      href += tag === 'a' && tree[i].target ? ` target="${tree[i].target}"` : '';
      template += `<li class="menuTreeItem${tree[i].disabled ? ' disabled' : ''}">
      <${tag}${href} class="menuTreeItemLabel" data-treepos='[${treePos}]'>
        ${tree[i].label || ''}
      </${tag}>`;
      if (tree[i].tree) {
        template += this._createTreeTemplate(tree[i].tree, treePos);
      }
      template += '</li>';
    }
    template += '</ul>';
    return template;
  };

  _getLabelTag = (item) => {
    if (item.tag) return item.tag;
    if (!item.tag && item.link) return 'a';
    if (!item.tag && !item.link && (item.onClick || item.routeLink)) return 'button';
    return 'span';
  };

  _treeOnClick = (e) => {
    e.stopPropagation();
    const elem = e.target;
    const treePos = JSON.parse(elem.getAttribute('data-treepos'));
    if (!treePos?.length) return;

    let treeItem = this.tree;
    let disabled = false;
    for (let i = 0; i < treePos.length; i++) {
      const nextIndex = treePos[i];
      if (treeItem[nextIndex].disabled) disabled = true; // This disables the whole tree or subtree
      if (i + 1 === treePos.length) {
        treeItem = treeItem[nextIndex];
      } else {
        treeItem = treeItem[nextIndex]?.tree;
      }
    }

    if (disabled) {
      e.preventDefault();
      return;
    }
    if (treeItem.onClick) treeItem.onClick(e, treeItem);
    if (treeItem.routeLink) {
      if (!this.router) {
        console.warn(`Tree item has a routeLink prop but no router is found.`);
        return;
      }
      this.router.changeRoute(treeItem.routeLink, { forceUpdate: this.forceUpdateRouteLinks });
    }
  };
}

export default MenuTree;
