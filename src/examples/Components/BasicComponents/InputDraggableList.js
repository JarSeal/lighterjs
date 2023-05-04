import { Component } from '../../../Lighter';

// props:
// - list: array of objects [
//   {
//     - orderNr?: number (the order number starting from 0 for the item on the list, if no orderNr is found, the key are created, the array is first sorted with orderNrs and then the ones without)
//     - content?: string/template (the string or template for the content, componentProps is prioritised)
//     - component?: Component (the content component to show as the item, this is prioritised before content)
//     - componentProps?: Component props (the props to pass to the component, the orderNr is passed to the props)
//   }
// ]
// - orderNrKey?: string (the order number key to sort with and possibly create if missing for each item on list, default 'orderNr')
// @TODO: - isHorisontal?: boolean (whether the list is horisontal or not/vertical, default false = vertical)
// - onChange?: function(list, this) (when an order changes, the onChange callback is called)
// - disabled?: boolean (whether the whole list is disabled or not, default false)
// - addStylesToHead?: boolean (whether to add basic CSS styles to document head, default true)
class InputDraggableList extends Component {
  constructor(props) {
    super(props);
    if (props.addStylesToHead !== false) addStylesToHead();
    this.draggingElem = null;
    this.elemsNotDragged = null;
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
    this.listContainerIds = [this.id]; // @TODO: implement possibility to add other lists
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
        draggable="${!this.disabled}"
        data-order="${i}"
      >${list[i].content}</div>`;
    }
    template += '</div>';

    this.listComponent.draw({ template });

    // Create listeners
    let draggableElems = [...this.listComponent.elem.children];
    for (let i = 0; i < list.length; i++) {
      this.listComponent.addListener({
        id: 'dragstart-' + i,
        target: draggableElems[i],
        type: 'dragstart',
        fn: (e) => {
          this.draggingElem = e.target;
          this.elemsNotDragged = draggableElems.filter((elem) => elem !== this.draggingElem);
          this.draggingElem.classList.add('dragging');
        },
      });
      this.listComponent.addListener({
        id: 'dragend-' + i,
        target: draggableElems[i],
        type: 'dragend',
        fn: () => {
          this.draggingElem.classList.remove('dragging');
          this.elemsNotDragged = null;
          this.draggingElem = null;
          draggableElems = [...this.listComponent.elem.children];
          const tempList = [];
          let changeHappened = false;
          for (let i = 0; i < draggableElems.length; i++) {
            const oldListIndex = Number(draggableElems[i].getAttribute('data-order'));
            if (i !== oldListIndex) changeHappened = true;
            tempList[i] = { ...this.list[oldListIndex], [this.orderNrKey]: i };
            draggableElems[i].setAttribute('data-order', i);
          }
          this.list = list = tempList;
          if (this.onChange && changeHappened) this.onChange(this.list, this);
        },
      });
    }

    this.listComponent.addListener({
      id: 'dragover',
      type: 'dragover',
      fn: (e) => {
        if (!this.listContainerIds.includes(this.id)) return;
        e.preventDefault();
        const afterElement = this._getYDragAfterElement(e.clientY);
        if (!afterElement) {
          this.listComponent.elem.appendChild(this.draggingElem);
        } else {
          this.listComponent.elem.insertBefore(this.draggingElem, afterElement);
        }
      },
    });
  };

  _getYDragAfterElement = (mouseY) =>
    this.elemsNotDragged.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = mouseY - box.top - box.height * 0.5;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

export let defaultOrderNrKey = 'orderNr';

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = `
    .draggableList { padding: 8px; background-color: #eaeaea; }
    .draggableListItem { background-color: #fafafa; padding: 16px; cursor: move; transition: opacity 0.1s ease-out; }
    .draggableListItem + .draggableListItem { margin-top: 8px; }
    .draggableListItem.dragging { opacity: 0.5; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default InputDraggableList;
