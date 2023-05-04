import { Component } from '../../../Lighter';

// props:
// - list: array of objects [ (if a item specific component is used, orderNr, data, and componentProps are passed to it)
//   {
//     - orderNr?: number (the order number starting from 0 for the item on the list, if no orderNr is found,
//                        the keys are created, the array is first sorted with orderNrs and then the ones without)
//     - data?: any (will be passed to either the item specific component or common component)
//     - content?: string/template (the string or template for the content, componentProps is prioritised)
//     - component?: Component (the content component to show as the item, this is prioritised before content)
//     - componentProps?: Component props (the props to pass to the component)
//   }
// ]
// @TODO: - commonComponent?: Component (list item component)
// @TODO: - commonComponentProps?: (these props are passed to either the specific item component or the commonComponent)
// - onChange?: function(list, this) (when an order changes, the onChange callback is called)
// - disabled?: boolean (whether the whole list is disabled or not, default false)
// - dragToListIds?: string/array (list of draggable lists that this list can drag to, default undefined)
// @TODO: - isHorisontal?: boolean (whether the list is horisontal or not/vertical, default false = vertical)
// @TODO: - dragHandleTemplate?: template (if given, the drag handle is used to drag items, default undefined = whole item is draggable)
// @TODO: - dragHandleAppend?: boolean (whether the drag handle, if used, is appended to the list item, default false = prepend)
// - orderNrKey?: string (the order number key to sort with and possibly create if missing for each item on list, default 'orderNr')
// - addStylesToHead?: boolean (whether to add basic CSS styles to document head, default true)
class InputDraggableList extends Component {
  constructor(props) {
    super(props);
    this.isDragging = false;
    if (props.addStylesToHead !== false) addStylesToHead();
    this.props.template = `<div class="inputDraggableList"></div>`;
    this.listComponent = this.add({ id: this.id + '-list-component' });
  }

  ignorePropChanges = () => ['template'];

  paint = (props) => {
    if (!props.list) {
      console.error('InputDraggableList has to have a list prop, ID: ', this.id);
      throw new Error('list prop missing');
    }
    this.list = props.list;
    this.orderNrKey = props.orderNrKey || defaultOrderNrKey;
    this.onChange = props.onChange || null;
    this.disabled = props.disabled || false;
    let dragToListIds = [];
    if (typeof props.dragToListIds === 'string') {
      dragToListIds = [props.dragToListIds];
    } else if (Array.isArray(props.dragToListIds)) {
      dragToListIds = props.dragToListIds;
    } else if (props.dragToListIds !== undefined) {
      console.warn('"dragToListIds" prop, if defined, must be a string or an array, ID:', this.id);
    }
    this.dragToListIds = [this.id, ...dragToListIds];
    this.updateList(this.list);
  };

  updateList = (list) => {
    const foundComponentProps = list.find((item) => item.componentProps);
    list.sort((a, b) => {
      if (isNaN(a[this.orderNrKey])) return 1;
      if (isNaN(b[this.orderNrKey])) return -1;
      return a[this.orderNrKey] - b[this.orderNrKey];
    });

    // Create a list of components
    if (foundComponentProps) {
      for (let i = 0; i < list.length; i++) {
        // const item = list[i];
        // @TODO: implement components based list
      }
      return;
    }

    // Create a list with a single template (lighter)
    let template = `<div class="draggableList${this.disabled ? ' disabled' : ''}" id="${this.id}">`;
    for (let i = 0; i < list.length; i++) {
      list[i][this.orderNrKey] = i;
      template += `<div
        class="draggableListItem"
        data-order="${i}"
      >${list[i].content}</div>`;
    }
    template += '</div>';

    this.listComponent.draw({ template });

    // Create listeners
    // let draggableElems = [...this.listComponent.elem.children];

    // Start drag
    let curElem = null,
      curSpacer = null,
      dragStartMousePos = null,
      dragStartScrollPos = null;
    this.listComponent.addListener({
      id: 'mousedown',
      type: 'mousedown',
      fn: (e) => {
        const elem = e.target;
        if (!elem.classList.contains('draggableListItem')) return;
        curElem = elem;
        this.isDragging = true;
        const elemDimensions = elem.getBoundingClientRect();
        const position = `top:${elemDimensions.top}px;left:${elemDimensions.left};z-index:900;position:fixed;margin:0;`;
        const size = `box-sizing:border-box;width:${elem.offsetWidth}px;height:${elem.offsetHeight}px;`;
        const transform = `transform:translate(0,0);`;
        elem.style.cssText = position + size + transform + 'pointer-events:none;';
        elem.classList.add('dragging');
        let loop = true,
          nextSibling = elem.nextSibling;
        while (loop) {
          if (nextSibling) {
            nextSibling.style.transform = `translate(0,${elem.offsetHeight}px)`;
            nextSibling = nextSibling.nextSibling;
          } else {
            loop = false;
          }
        }
        curSpacer = this.listComponent.addDraw({
          style: { width: elem.offsetWidth + 'px', height: elem.offsetHeight + 'px' },
        });
        dragStartMousePos = [e.clientX, e.clientY];
        dragStartScrollPos = [window.scrollX, window.scrollY];
        this.listComponent.elem.style.userSelect = 'none';
      },
    });

    // End drag
    const returnAnimSpeed = 280;
    this.listComponent.addListener({
      id: 'mouseup',
      target: window,
      type: 'mouseup',
      fn: () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        dragStartMousePos = null;
        if (curElem) {
          curElem.style.transitionDuration = returnAnimSpeed + 'ms';
          setTimeout(() => {
            const scrollOffset = [
              dragStartScrollPos[0] - window.scrollX,
              dragStartScrollPos[1] - window.scrollY,
            ];
            curElem.style.transform = `translate(${scrollOffset[0]}px, ${scrollOffset[1]}px)`;
          }, 5);
        }
        setTimeout(() => {
          dragStartScrollPos = null;
          if (curElem) {
            curElem.classList.remove('dragging');
            curElem.style.cssText = '';
            curElem = null;
          }
          if (curSpacer) {
            curSpacer.discard(true);
            curSpacer = null;
          }
          const children = [...this.listComponent.elem.children];
          for (let i = 0; i < children.length; i++) {
            children[i].style.cssText = '';
          }
          this.listComponent.elem.style.removeProperty('user-select');
        }, returnAnimSpeed + 5);
      },
    });

    // Drag over
    this.listComponent.addListener({
      id: 'mousemove',
      target: window,
      type: 'mousemove',
      fn: (e) => {
        if (!this.isDragging || !curElem) return;
        const offset = [e.clientX - dragStartMousePos[0], e.clientY - dragStartMousePos[1]];
        curElem.style.transform = `translate(${offset[0]}px,${offset[1]}px)`;
      },
    });
  };
}

export let defaultOrderNrKey = 'orderNr';

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = `
    .draggableList { padding: 8px; background-color: #eaeaea; overflow-anchor: none; }
    .draggableListItem {
      /* NEEDED */
      margin: 0 !important;
      box-sizing: border-box !important;
      cursor: move;

      background-color: #fafafa;
      padding: 16px;
      border-top: 1px solid #e4e4e4;
      box-shadow: none;
    }
    .draggableListItem:first-child { border-top: none; }
    .draggableListItem.dragging {
      transition: transform cubic-bezier(.17,.83,.68,.94), box-shadow ease-in;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    }
    .draggableList.disabled .draggableListItem { cursor: auto; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default InputDraggableList;
