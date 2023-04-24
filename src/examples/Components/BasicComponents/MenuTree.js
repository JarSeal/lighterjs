import { Component } from '../../../Lighter';

// props:
// - tree: [
//   {
//     - label: string/template (text or html to display on the menu item)
//     - link?: string (link string, if also the onClick is defined, the link is called after the onClick)
//     - onClick?: function() (function for the item click)
//     - disabled?: boolean (whether the item and its children are disabled or not, default false)
//     - tree?: array of objects (same as the parent tree)
//   }
// ]
// - disabled?: boolean (whether the whole menu tree is disabled or not, default false)
// - inlineStyles?: boolean (whether basic inline CSS styles are applied or not, default false)
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
    if (this.treeComponent?.idComponent) this.treeComponent.discard(true);
  };

  paint = (props) => {
    this._defineProps(props);
    const template = this._createTreeTemplate();
    this.treeComponent = this.addDraw({ template });
  };

  _createTreeTemplate = (prevIdPrefix) => {
    let idPrefix = prevIdPrefix || `mt-${this.id}`;
    let template = '<ul class="menuTreeGroup">';
    for (let i = 0; i < this.tree.length; i++) {
      const itemId = `${idPrefix}__${i}`;
      template += `<li
        class="menuTreeItem${this.tree[i].disabled ? ' disabled' : ''}"
        id="${itemId}"
      ><span class="menuTreeItemLabel">${this.tree[i].label || ''}</span>`;
      if (this.tree[i].tree) {
        template += this._createTreeTemplate(itemId);
      }
      template += '</li>';
    }
    template += '</ul>';
    return template;
  };
}

export default MenuTree;
