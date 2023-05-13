import { Component } from '../../../Lighter';

// props:
// - list: array of objects [ (if a item specific component is used, orderNr, data, and componentProps are passed to it)
//   {
//     - orderNr?: number (the order number starting from 0 for the item on the list, if no orderNr is found,
//                        the keys are created, the array is first sorted with orderNrs and then the ones without)
//     - data?: any (will be passed to either the item specific component or common component)
//     - template?: string/template (the string or template for the content, for simple lists)
//     - component?: Component (the content component to show as the item, this is prioritised before content)
//     - componentProps?: Component props (the props per item to pass to the component)
//   }
// ]
// - commonComponent?: Component (list item component)
// - commonComponentProps?: (these props are passed to either the specific item component or the commonComponent)
// - onChange?: function(list, this) (when an order changes, the onChange callback is called)
// - disabled?: boolean (whether the whole list is disabled or not, default false)
// - dragToListIds?: string/array (list of draggable lists that this list can drag to, default undefined)
// @TODO: - isHorisontal?: boolean (whether the list is horisontal or not/vertical, default false = vertical) // I DON'T KNOW ABOUT THIS ONE???
// - dragHandleTemplate?: template (if given, the drag handle is used to drag items, default undefined = whole item is draggable)
// - orderNrKey?: string (the order number key to sort with and possibly create if missing for each item on list, default 'orderNr')
// - addStylesToHead?: boolean (whether to add basic CSS styles to document head, default true)

// @CONSIDER/@TODO:
// - drag movements should detect scroll area ends and start scrolling if dragging pointer is in that area
// - scrolls shouldn't be just window, but all scrollable list parent elements
// - needs tests with a touch device and possibly needs own listeners for that

class InputDraggableList extends Component {
  constructor(props) {
    super(props);
    this.isInputDraggableList = true;
    this.isDragging = false;
    if (props.addStylesToHead !== false) addStylesToHead();
    this.props.template = `<div class="inputDraggableList"></div>`;
    this.listComponent = this.add({ id: this.id + '-list-component' });
  }

  ignorePropChanges = () => ['template', 'orderNrKey', 'addStylesToHead', 'dragHandleTemplate'];

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
    let foundComponentProps = list.find((item) => item.componentProps);
    if (this.props.commonComponentProps) foundComponentProps = true;
    list.sort((a, b) => {
      if (isNaN(a[this.orderNrKey])) return 1;
      if (isNaN(b[this.orderNrKey])) return -1;
      return a[this.orderNrKey] - b[this.orderNrKey];
    });

    let template = `<div class="draggableList${this.disabled ? ' disabled' : ''}" id="${this.id}">`;
    // Create a list with a single template
    for (let i = 0; i < list.length; i++) {
      list[i][this.orderNrKey] = i;
      template += `<div
        class="draggableListItem"
        data-order="${i}"
      >
        <div class="draggableHandle">${this.dragHandleTemplate}</div>
        <div class="draggableItemContent"${foundComponentProps ? ` id="${this.id}-item-${i}"` : ''}>
          ${foundComponentProps ? '' : list[i].template || ''}
        </div>
      </div>`;
    }
    template += '</div>';
    this.listComponent.draw({ template });

    if (foundComponentProps) {
      // Create an all component based list
      for (let i = 0; i < list.length; i++) {
        list[i][this.orderNrKey] = i;
        let props = {
          ...(this.props.commonComponentProps || {}),
          ...(list[i].componentProps || {}),
        };
        props.attachId = `${this.id}-item-${i}`;
        if (list[i].component) {
          // per item component
          this.listComponent.addDraw(new list[i].component(props));
          continue;
        }
        if (this.props.commonComponent) {
          // commonComponent
          this.listComponent.addDraw(new this.props.commonComponent(props));
          continue;
        }
        // basic div component
        this.listComponent.addDraw(props);
      }
    }

    const children = [...this.listComponent.elem.children];
    for (let i = 0; i < children.length; i++) {
      children[i].draggableListIndex = i;
    }

    // Create listeners

    // START DRAG
    let curElem = null,
      curSpacer = null,
      externalSpacers = {},
      dragStartMousePos = null,
      dragStartScrollPos = null,
      dragStartElemBox = null,
      dragContainerWidths = [],
      dragContainerTopPaddingAndBorders = [],
      curContainerIndex = 0;
    this.listComponent.addListener({
      id: 'mousedown',
      type: 'mousedown',
      fn: (e) => {
        let elem = e.target;
        if (
          e.button !== 0 ||
          !this._clickedOnDragHandle(e, elem) ||
          this.disabled ||
          !elem.parentNode.classList.contains('draggableListItem')
        ) {
          // Has to be a left click, on the drag handle, list should not be disabled,
          // and the drag handle parent elem should have the draggableListItem class
          return;
        }
        this.elem.classList.add('dragHappening');
        e.preventDefault();

        elem = elem.parentNode; // Because we are dragging the drag handle
        curContainerIndex = 0;
        const children = [...this.listComponent.elem.children];
        for (let i = 0; i < children.length; i++) {
          children[i].style.cssText = '';
          children[i].classList.remove('dragging');
          children[i]._startTopPos = children[i].getBoundingClientRect().top;
          children[i]._startBottomPos = children[i].getBoundingClientRect().bottom;
        }

        // Get all containers elem widths
        for (let i = 0; i < this.dragToListIds.length; i++) {
          const containerElem = this.getComponentById(this.dragToListIds[i])?.listComponent?.elem;
          const cs = getComputedStyle(containerElem);
          const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
          const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
          dragContainerWidths[i] = containerElem.getBoundingClientRect().width - paddingX - borderX;
          dragContainerTopPaddingAndBorders[i] =
            parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop);
        }

        curElem = elem;
        this.isDragging = true;
        dragStartElemBox = elem.getBoundingClientRect();
        const position = `top:${dragStartElemBox.top}px;left:${dragStartElemBox.left};z-index:900;position:fixed;margin:0;`;
        const size = `box-sizing:border-box;width:${elem.offsetWidth}px;height:${elem.offsetHeight}px;`;
        const transform = `transform:translate(0,0);`;
        elem.style.cssText = position + size + transform;
        elem.classList.add('dragging');

        let nextSibling = elem.nextSibling,
          prevSibling = elem.previousSibling;
        while (prevSibling) {
          prevSibling.draggableElemIsBelow = true;
          prevSibling = prevSibling.previousSibling;
        }
        while (nextSibling) {
          nextSibling.draggableElemIsBelow = false;
          nextSibling.style.transform = `translate(0,${elem.offsetHeight}px)`;
          nextSibling = nextSibling.nextSibling;
        }

        curSpacer = this.listComponent.addDraw({
          style: {
            width: elem.offsetWidth + 'px',
            height: elem.offsetHeight + 'px',
            userSelect: 'none',
          },
        });

        dragStartMousePos = [e.clientX, e.clientY];
        dragStartScrollPos = [window.scrollX, window.scrollY];
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
        this.elem.classList.remove('dragHappening');
        if (!curElem) return;
        let animSpeed = returnAnimSpeed,
          currentTargetList = this.listComponent,
          isTransfer = false,
          targetComponent;
        if (curContainerIndex !== 0) {
          currentTargetList = this.getComponentById(
            this.dragToListIds[curContainerIndex]
          ).listComponent;
          targetComponent = this.getComponentById(this.dragToListIds[curContainerIndex]);
          isTransfer = true;
        }
        if (!this.listComponent?.elem || !currentTargetList?.elem) return;
        const children = [...currentTargetList.elem.children];
        let newList = [];

        // Move curElem in DOM
        let positionFound = false,
          newTop = 0;
        for (let i = 0; i < children.length; i++) {
          if (
            children[i] !== curElem &&
            children[i].classList.contains('draggableListItem') &&
            children[i].draggableElemIsBelow === false
          ) {
            positionFound = true;
            currentTargetList.elem.insertBefore(curElem, children[i]);
            break;
          }
        }
        if (!positionFound) {
          // Insert as the last element
          currentTargetList.elem.insertBefore(curElem, children[children.length - 1]);
        }

        let hasChanges = false,
          curItem = null;
        if (!isTransfer) {
          // The drag is a local drag
          const reOrderedChildren = [...this.listComponent.elem.children];
          let runningIndex = 0;
          // Reindex the elements and set newTop for dragged elem
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
          if (hasChanges) {
            this.list = newList.map((item, index) => {
              item[this.orderNrKey] = index;
              return item;
            });
          }
        } else {
          // The drag is transfer to another container
          const reOrderedChildren = [...currentTargetList.elem.children];
          let runningIndex = 0,
            newIndex = 0;
          const curIndex = Number(curElem.getAttribute('data-order'));
          // Reindex the elements in the target container and set newTop for dragged elem
          for (let i = 0; i < reOrderedChildren.length; i++) {
            if (reOrderedChildren[i].classList.contains('draggableListItem')) {
              if (reOrderedChildren[i] === curElem) {
                if (curElem.previousSibling) {
                  newTop = curElem.previousSibling._startBottomPos;
                  newIndex = Number(curElem.previousSibling.getAttribute('data-order')) + 1;
                } else if (
                  curElem.nextSibling &&
                  curElem.nextSibling.classList.contains('draggableListItem')
                ) {
                  newTop = curElem.nextSibling._startTopPos;
                  newIndex = Number(curElem.nextSibling.getAttribute('data-order'));
                } else {
                  newTop =
                    currentTargetList.elem.getBoundingClientRect().top +
                    dragContainerTopPaddingAndBorders[curContainerIndex];
                }
              }
              reOrderedChildren[i].setAttribute('data-order', runningIndex);
              reOrderedChildren[i].draggableListIndex = runningIndex;
            }
            runningIndex++;
          }
          hasChanges = true;
          curItem = this.list[curIndex];
          this.removeFromList(curIndex, false);
          targetComponent.addToList(newIndex, curItem, false);
          const children = [...this.listComponent.elem.children];
          // Reindex the elements in the old container
          runningIndex = 0;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.classList.contains('draggableListItem')) {
              child.setAttribute('data-order', runningIndex);
              runningIndex++;
            }
          }
        }

        // Update list and call possible onChange
        if (hasChanges) {
          if (this.onChange) this.onChange(this.list, this);
          if (targetComponent?.onChange) {
            targetComponent.onChange(targetComponent.list, targetComponent);
          }
        }

        // Correct the curElem top position
        const currentOffset = [e.clientX - dragStartMousePos[0], e.clientY - dragStartMousePos[1]];
        const newTopOffset = newTop - dragStartElemBox.top;
        curElem.style.transitionDuration = '0ms';
        curElem.style.transform = `translate(${currentOffset[0]}px,${
          currentOffset[1] - newTopOffset
        }px)`;
        curElem.style.top = newTop + 'px';

        // Calculate scrollOffset (if dragging is going on and the page is scrolled)
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
        if (isTransfer) curSpacer.elem.style.transition = `height ${animSpeed * 0.5}ms ease-in-out`;

        setTimeout(() => {
          if (!curElem) return;
          curElem.style.transitionDuration = animSpeed + 'ms';
          curElem.style.transform = `translate(${scrollOffset[0]}px, ${scrollOffset[1]}px)`;
          if (isTransfer) {
            const children = [...this.listComponent.elem.children];
            for (let i = 0; i < children.length; i++) {
              if (children[i].classList.contains('draggableListItem')) {
                children[i].style.transform = 'translate(0,0)';
              }
            }
          }
        }, 5);

        dragStartMousePos = null;
        dragStartScrollPos = null;
        setTimeout(() => {
          if (curElem) {
            curElem.classList.remove('dragging');
            curElem.style.cssText = '';
            curElem = null;
          }
          if (curSpacer?.elem) curSpacer.elem.style.height = 0;
          for (let i = 0; i < this.dragToListIds.length; i++) {
            const containerId = this.dragToListIds[i];
            if (containerId !== this.id && externalSpacers[containerId]?.isComponent) {
              externalSpacers[containerId].discard();
              externalSpacers[containerId] = null;
            }
            const containerChildren = [
              ...this.getComponentById(containerId).listComponent.elem.children,
            ];
            for (let j = 0; j < containerChildren.length; j++) {
              const child = containerChildren[j];
              if (child.classList.contains('draggableListItem')) child.style.cssText = '';
            }
          }
          this.listComponent.elem.style.removeProperty('user-select');
          setTimeout(() => {
            // Remove the curSpacer after the shrink animation
            if (curSpacer && !this.isDragging) {
              curSpacer.discard(true);
              curSpacer = null;
            }
          }, animSpeed * 0.5);
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
        let isHoveringContainer = false;

        // Loop all allowed containers
        for (let i = 0; i < this.dragToListIds.length; i++) {
          const containerId = this.dragToListIds[i];
          let containerElem = null,
            dragComponent = null,
            containerChanged = false;
          if (containerId === this.id) {
            containerElem = this.listComponent.elem;
            dragComponent = this;
          } else {
            containerElem = document.getElementById(containerId);
            dragComponent = this.getComponentById(containerId);
          }
          if (!containerElem || dragComponent.disabled) return;
          if (this._mouseIsOnTopOfElem(e, containerElem)) {
            isHoveringContainer = true;
            if (containerId !== this.id) {
              // External container
              if (curContainerIndex !== i) containerChanged = true;
              curContainerIndex = i;
              if (!externalSpacers[containerId]) {
                // Create the spacer if not found
                externalSpacers[containerId] = dragComponent.listComponent.addDraw({
                  style: {
                    width: 0,
                    height: 0,
                    transition: `height ${siblingAnimSpeed}ms ease-in-out`,
                    userSelect: 'none',
                  },
                });
              }
              if (containerChanged) {
                const containerChildren = [...containerElem.children];
                const curElemTop = curElem.getBoundingClientRect().top;
                for (let j = 0; j < containerChildren.length; j++) {
                  const child = containerChildren[j];
                  if (!child.classList.contains('draggableListItem')) continue;
                  child.style.transition = `transform ${siblingAnimSpeed}ms ease-in-out`;
                  const childBox = child.getBoundingClientRect();
                  // Set _draggableElemIsBelow to wrong (opposite) values so that they are checked in _checkPositionToSiblingsAndMoveThem
                  if (curElemTop < childBox.top + childBox.height * 0.5) {
                    child._draggableElemIsBelow = true;
                  } else {
                    child._draggableElemIsBelow = false;
                  }
                  containerChildren[j]._startTopPos =
                    containerChildren[j].getBoundingClientRect().top;
                  containerChildren[j]._startBottomPos =
                    containerChildren[j].getBoundingClientRect().bottom;
                }
                setTimeout(() => {
                  externalSpacers[containerId].elem.style.width =
                    dragContainerWidths[curContainerIndex] + 'px';
                  externalSpacers[containerId].elem.style.height = curElem.offsetHeight + 'px';
                  for (let j = 0; j < containerChildren.length; j++) {
                    const child = containerChildren[j];
                    child.style.transform = `translate(0,${curElem.offsetHeight}px)`;
                  }
                  this._checkPositionToSiblingsAndMoveThem(containerElem, curElem);
                }, 5);
              } else {
                this._checkPositionToSiblingsAndMoveThem(containerElem, curElem);
              }
            } else {
              // Same container that the drag started in or no container hovered
              this._checkPositionToSiblingsAndMoveThem(containerElem, curElem);
              if (containerId !== this.id && externalSpacers[containerId]) {
                externalSpacers[containerId].elem.style.height = curElem.offsetHeight + 'px';
              }
            }
          } else {
            if (containerId !== this.id) {
              const containerChildren = [...dragComponent.listComponent.elem.children];
              for (let j = 0; j < containerChildren.length; j++) {
                const child = containerChildren[j];
                child.style.transform = 'translate(0,0)';
              }
              if (externalSpacers[containerId]) externalSpacers[containerId].elem.style.height = 0;
            } else {
              this._checkPositionToSiblingsAndMoveThem(containerElem, curElem);
            }
          }
        }
        if (!isHoveringContainer) curContainerIndex = 0;
      },
    });
  };

  // if index is 'null' or a negative number, the newItem will be placed at the end of the list
  addToList = (index, newItem, reDraw = true) => {
    if (isNaN(index) || !newItem) {
      console.error(`'addToList' has to have an index and/or newItem, ID: ${this.id}`);
      throw new Error('index and/or newItem missing or invalid type');
    }
    const newList = [];
    const listLength = this.list.length;
    if (index === null || index < 0) index = Infinity;
    let newItemAdded = false;
    for (let i = 0; i < listLength + 1; i++) {
      if ((i === index || i === listLength) && !newItemAdded) {
        newItem[this.orderNrKey] = i;
        newList.push(newItem);
        newItemAdded = true;
      }
      if (i === listLength) break;
      let newIndex = i;
      if (index <= i) newIndex = i + 1;
      this.list[i][this.orderNrKey] = newIndex;
      newList.push(this.list[i]);
    }
    this.list = newList;
    if (reDraw) this.draw({ list: this.list });
    return this.list;
  };

  removeFromList = (indexOrFilterFn, reDraw = true) => {
    if (isNaN(indexOrFilterFn) && typeof indexOrFilterFn !== 'function') {
      console.error(
        `Provide either the index number of the item to be removed or the filterFn, ID: ${this.id}`
      );
      throw new Error('index and filterFn missing or invalid type');
    }
    let newList;
    if (isNaN(indexOrFilterFn)) {
      // indexOrFilterFn is a function
      newList = this.list.filter(indexOrFilterFn).map((item, i) => {
        item[this.orderNrKey] = i;
        return item;
      });
    } else {
      // indexOrFilterFn is a number
      newList = this.list
        .filter((_, i) => i !== indexOrFilterFn)
        .map((item, i) => {
          item[this.orderNrKey] = i;
          return item;
        });
    }
    this.list = newList;
    if (reDraw) this.draw({ list: this.list });
    return this.list;
  };

  _checkPositionToSiblingsAndMoveThem = (containerElem, curElem) => {
    const children = [...containerElem.children];
    for (let i = 0; i < children.length; i++) {
      if (children[i] === curElem || !children[i].classList.contains('draggableListItem')) continue;
      children[i].style.transition = `transform ${siblingAnimSpeed}ms ease-in-out`;
      const curElemBox = curElem.getBoundingClientRect();
      const childBox = children[i].getBoundingClientRect();
      if (
        curElemBox.top < childBox.top + childBox.height * 0.5 &&
        children[i]._draggableElemIsBelow
      ) {
        children[i].prevTop = children[i].getBoundingClientRect().top;
        children[i].style.transform = `translate(0,${curElemBox.height}px)`;
        children[i].draggableElemIsBelow = false;
        setTimeout(() => (children[i]._draggableElemIsBelow = false), 200);
        continue;
      }
      if (
        curElemBox.bottom > childBox.top + childBox.height * 0.5 &&
        !children[i]._draggableElemIsBelow
      ) {
        children[i].prevTop = children[i].getBoundingClientRect().top;
        children[i].style.transform = 'translate(0,0)';
        children[i].draggableElemIsBelow = true;
        setTimeout(() => (children[i]._draggableElemIsBelow = true), siblingAnimSpeed);
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
export let siblingAnimSpeed = 200;

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
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
    :not(.dragHappening) .draggableListItem > .draggableHandle {
      cursor: move;
      cursor: -webkit-grab;
      cursor: grab;
    }
    .dragHappening .draggableListItem > .draggableHandle,
    .dragHappening .draggableListItem * {
      cursor: move;
      cursor: -webkit-grabbing;
      cursor: grabbing;
    }
    .draggableList.disabled .draggableListItem > .draggableHandle { cursor: auto; }
    .draggableListItem > .draggableItemContent {
      position: relative;
      z-index: 2;
    }
    .draggableListItem:first-child { border-top: none; }
    .draggableListItem.dragging {
      transition: transform cubic-bezier(.42,.31,0,.95), box-shadow ease-in;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default InputDraggableList;
