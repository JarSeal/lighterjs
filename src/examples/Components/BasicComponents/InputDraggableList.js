import { Component } from '../../../Lighter';

// props:
// - list: array of objects [ (if a item specific component is used, orderNr, data, and componentProps are passed to it)
//   {
//     - orderNr?: number (the order number starting from 0 for the item on the list, if no orderNr is found,
//                        the keys are created, the array is first sorted with orderNrs and then the ones without)
//     - data?: any (will be passed to either the item specific component or common component)
//     - content?: string/template (the string or template for the content, this is much lighter than components)
//     - component?: Component (the content component to show as the item, this is prioritised before content)
//     - componentProps?: Component props (the props per item to pass to the component)
//   }
// ]
// @TODO: - commonComponent?: Component (list item component)
// @TODO: - commonComponentProps?: (these props are passed to either the specific item component or the commonComponent)
// - onChange?: function(list, this) (when an order changes, the onChange callback is called)
// - disabled?: boolean (whether the whole list is disabled or not, default false)
// - dragToListIds?: string/array (list of draggable lists that this list can drag to, default undefined)
// @TODO: - isHorisontal?: boolean (whether the list is horisontal or not/vertical, default false = vertical) // I DON'T KNOW ABOUT THIS ONE???
// - dragHandleTemplate?: template (if given, the drag handle is used to drag items, default undefined = whole item is draggable)
// - orderNrKey?: string (the order number key to sort with and possibly create if missing for each item on list, default 'orderNr')
// - addStylesToHead?: boolean (whether to add basic CSS styles to document head, default true)

// @CONSIDER/@TODO:
// - scrolls shouldn't be just window, but all scrollable list parent elements
// - drag movements should detect scroll area ends and start scrolling if dragging pointer is in that area

class InputDraggableList extends Component {
  constructor(props) {
    super(props);
    this.isInputDraggableList = true;
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
    this.dragHandleTemplate = props.dragHandleTemplate || '';
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
      >
        <div class="draggableHandle">${this.dragHandleTemplate}</div>
        <div class="draggableItemContent">${list[i].content}</div>
      </div>`;
    }
    template += '</div>';

    this.listComponent.draw({ template });
    const children = [...this.listComponent.elem.children];
    for (let i = 0; i < children.length; i++) {
      children[i].draggableListIndex = i;
    }

    // Create listeners

    // START DRAG
    let curElem = null,
      curSpacer = null,
      dragStartMousePos = null,
      dragStartScrollPos = null,
      dragStartElemBox = null;
    this.listComponent.addListener({
      id: 'mousedown',
      type: 'mousedown',
      fn: (e) => {
        let elem = e.target;
        if (
          !this._clickedOnDragHandle(e, elem) ||
          this.disabled ||
          !elem.parentNode.classList.contains('draggableListItem')
        ) {
          return;
        }
        e.preventDefault();
        elem = elem.parentNode;
        const children = [...this.listComponent.elem.children];
        for (let i = 0; i < children.length; i++) {
          children[i].style.cssText = '';
          children[i].classList.remove('dragging');
          children[i]._startTopPos = children[i].getBoundingClientRect().top;
          children[i]._startBottomPos = children[i].getBoundingClientRect().bottom;
        }
        curElem = elem;
        this.isDragging = true;
        dragStartElemBox = elem.getBoundingClientRect();
        const position = `top:${dragStartElemBox.top}px;left:${dragStartElemBox.left};z-index:900;position:fixed;margin:0;`;
        const size = `box-sizing:border-box;width:${elem.offsetWidth}px;height:${elem.offsetHeight}px;`;
        const transform = `transform:translate(0,0);`;
        elem.style.cssText = position + size + transform + 'pointer-events:none;';
        elem.classList.add('dragging');
        let nextSibling = elem.nextSibling,
          prevSibling = elem.previousSibling;
        while (prevSibling) {
          prevSibling.draggableElemBelow = true;
          prevSibling = prevSibling.previousSibling;
        }
        while (nextSibling) {
          nextSibling.draggableElemBelow = false;
          nextSibling.style.transform = `translate(0,${elem.offsetHeight}px)`;
          nextSibling = nextSibling.nextSibling;
        }
        curSpacer = this.listComponent.addDraw({
          style: { width: elem.offsetWidth + 'px', height: elem.offsetHeight + 'px' },
        });
        dragStartMousePos = [e.clientX, e.clientY];
        dragStartScrollPos = [window.scrollX, window.scrollY];
        this.listComponent.elem.style.userSelect = 'none';
      },
    });

    // END DRAG
    this.listComponent.addListener({
      id: 'mouseup',
      target: window,
      type: 'mouseup',
      fn: (e) => {
        if (!this.isDragging || this.disabled) return;
        this.isDragging = false;
        let animSpeed = returnAnimSpeed;
        if (!this.listComponent?.elem) return;
        const children = [...this.listComponent.elem.children];
        const newList = [];
        if (curElem) {
          // Move curElem in DOM
          let positionFound = false,
            newTop = 0;
          for (let i = 0; i < children.length; i++) {
            if (
              children[i] !== curElem &&
              children[i].classList.contains('draggableListItem') &&
              children[i].draggableElemBelow === false
            ) {
              positionFound = true;
              this.listComponent.elem.insertBefore(curElem, children[i]);
              break;
            }
          }
          if (!positionFound) {
            // Insert as the last element
            this.listComponent.elem.insertBefore(curElem, children[children.length - 1]);
          }

          // Reindex the elements and set newTop for dragged elem
          const reOrderedChildren = [...this.listComponent.elem.children];
          let runningIndex = 0,
            hasChanges = true;
          for (let i = 0; i < reOrderedChildren.length; i++) {
            if (reOrderedChildren[i].classList.contains('draggableListItem')) {
              if (reOrderedChildren[i] === curElem) {
                hasChanges = Number(curElem.getAttribute('data-order')) !== runningIndex;
                if (dragStartElemBox.top < curElem.getBoundingClientRect().top) {
                  // Moved down
                  if (
                    reOrderedChildren[i + 1] &&
                    reOrderedChildren[i + 1].classList.contains('draggableListItem') &&
                    hasChanges
                  ) {
                    newTop =
                      reOrderedChildren[i + 1]._startTopPos -
                      curElem.getBoundingClientRect().height;
                  } else if (
                    reOrderedChildren[i - 1] &&
                    reOrderedChildren[i - 1].classList.contains('draggableListItem') &&
                    hasChanges
                  ) {
                    newTop =
                      reOrderedChildren[i - 1]._startBottomPos -
                      curElem.getBoundingClientRect().height;
                  } else {
                    newTop = dragStartElemBox.top;
                  }
                } else {
                  // Moved up
                  if (
                    reOrderedChildren[i - 1] &&
                    reOrderedChildren[i - 1].classList.contains('draggableListItem') &&
                    hasChanges
                  ) {
                    newTop = reOrderedChildren[i - 1]._startBottomPos;
                  } else if (
                    reOrderedChildren[i + 1] &&
                    reOrderedChildren[i + 1].classList.contains('draggableListItem') &&
                    hasChanges
                  ) {
                    newTop = reOrderedChildren[i + 1]._startTopPos;
                  } else {
                    newTop = dragStartElemBox.top;
                  }
                }
              }
              const currentItem =
                this.list[Number(reOrderedChildren[i].getAttribute('data-order'))];
              newList[runningIndex] = currentItem;
              reOrderedChildren[i].setAttribute('data-order', runningIndex);
              reOrderedChildren[i].draggableListIndex = runningIndex;
              runningIndex++;
            }
          }

          // update list and call possible onChange
          if (hasChanges) {
            this.list = newList;
            if (this.onChange) this.onChange(this.list, this);
          }

          // Correct the curElem top position
          const currentOffset = [
            e.clientX - dragStartMousePos[0],
            e.clientY - dragStartMousePos[1],
          ];
          const newTopOffset = newTop - dragStartElemBox.top;
          curElem.style.transitionDuration = '0ms';
          curElem.style.transform = `translate(${currentOffset[0]}px,${
            currentOffset[1] - newTopOffset
          }px)`;
          curElem.style.top = newTop + 'px';

          // Calculate scrollOffset
          const offset = [e.clientX - dragStartMousePos[0], e.clientY - dragStartMousePos[1]];
          const scrollOffset = [
            dragStartScrollPos[0] - window.scrollX,
            dragStartScrollPos[1] - window.scrollY,
          ];

          // Make the returnAnimSpeed faster if the original position is near enough
          if (
            Math.abs(offset[0] - scrollOffset[0]) < 50 &&
            Math.abs(offset[1] - scrollOffset[1]) < 50
          ) {
            animSpeed = returnAnimSpeed * 0.4;
          }

          setTimeout(() => {
            if (!curElem) return;
            curElem.style.transitionDuration = animSpeed + 'ms';
            curElem.style.transform = `translate(${scrollOffset[0]}px, ${scrollOffset[1]}px)`;
          }, 5);
        }
        dragStartMousePos = null;
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
          for (let i = 0; i < children.length; i++) {
            children[i].style.cssText = '';
          }
          this.listComponent.elem.style.removeProperty('user-select');
        }, animSpeed + 5);
      },
    });

    // DRAG HAPPENING
    this.listComponent.addListener({
      id: 'mousemove',
      target: window,
      type: 'mousemove',
      fn: (e) => {
        if (!this.isDragging || !curElem || this.disabled) return;
        const offset = [e.clientX - dragStartMousePos[0], e.clientY - dragStartMousePos[1]];
        curElem.style.transform = `translate(${offset[0]}px,${offset[1]}px)`;
        // Loop all allowed container elems
        for (let i = 0; i < this.dragToListIds.length; i++) {
          const containerId = this.dragToListIds[i];
          let containerElem = null,
            dragComponent = null;
          if (containerId === this.id) {
            containerElem = this.listComponent.elem;
            dragComponent = this;
          } else {
            containerElem = document.getElementById(containerId);
            dragComponent = this.getComponentById(containerId);
          }
          if (!containerElem || dragComponent.disabled) return;
          if (this._mouseIsOnTopOfElem(e, containerElem)) {
            this._checkPositionToSiblingsAndMoveThem(containerElem, curElem);
          } else {
            // @TODO: remove spacer and item position transforms from latestContainer and set latestContainer = null
          }
        }
        //    - Find which container is hovered on and add spacer to that container (if not hovering any, exit loop)
        //    - 4. Loop through all of its children
        //        - 5. Find child's getBoundingClientRect
        //        - 6. Check if curElem is above that elem and add transform (push it down)
      },
    });
  };

  _checkPositionToSiblingsAndMoveThem = (containerElem, curElem) => {
    const children = [...containerElem.children];
    for (let i = 0; i < children.length; i++) {
      if (children[i] === curElem || !children[i].classList.contains('draggableListItem')) continue;
      children[i].style.transition = 'transform 0.2s ease-in-out'; // @TODO: move this Drag start (mousedown) and remove this style in Drag stop (mouseup)
      const curElemBox = curElem.getBoundingClientRect();
      const childBox = children[i].getBoundingClientRect();
      if (
        curElemBox.top < childBox.top + childBox.height * 0.5 &&
        children[i]._draggableElemBelow
      ) {
        children[i].prevTop = children[i].getBoundingClientRect().top;
        children[i].style.transform = `translate(0,${curElemBox.height}px)`;
        children[i].draggableElemBelow = false;
        setTimeout(() => (children[i]._draggableElemBelow = false), 200);
        continue;
      }
      if (
        curElemBox.bottom > childBox.top + childBox.height * 0.5 &&
        !children[i]._draggableElemBelow
      ) {
        children[i].prevTop = children[i].getBoundingClientRect().top;
        children[i].style.transform = 'translate(0,0)';
        children[i].draggableElemBelow = true;
        setTimeout(() => (children[i]._draggableElemBelow = true), 200);
        continue;
      }
    }
  };

  _mouseIsOnTopOfElem = (e, elem) => {
    const elemBox = elem.getBoundingClientRect();
    return (
      elemBox.top < e.clientY &&
      elemBox.bottom > e.clientY &&
      elemBox.left < e.clientX &&
      elemBox.right > e.clientX
    );
  };

  _clickedOnDragHandle = (e, elem) => {
    const dragHandleClass = 'draggableHandle';
    if (elem.classList.contains(dragHandleClass)) return true;
    const handle = elem.parentNode.children[0];
    if (handle && handle.classList?.contains(dragHandleClass)) {
      return this._mouseIsOnTopOfElem(e, handle);
    }
    return false;
  };
}

export let defaultOrderNrKey = 'orderNr';
export let returnAnimSpeed = 250;

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = `
    .draggableList { padding: 8px; background-color: #eaeaea; overflow-anchor: none; }
    .draggableListItem {
      /* NEEDED */
      position: relative;
      margin: 0 !important;
      box-sizing: border-box !important;

      background-color: #fafafa;
      padding: 16px;
      border-top: 1px solid #e4e4e4;
      box-shadow: none;
    }
    .draggableListItem > .draggableHandle {
      cursor: move;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
    .draggableListItem > .draggableItemContent {
      position: relative;
      z-index: 2;
    }
    .draggableListItem:first-child { border-top: none; }
    .draggableListItem.dragging {
      transition: transform cubic-bezier(.42,.31,0,.95), box-shadow ease-in;
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
