import { Component } from '../../../Lighter';

// props:
// - list: array of objects [
//   {
//     - orderNr?: number (the order number starting from 0 for the item on the list, if no orderNr is found, they can be created with createOrderNumbers, otherwise array order is used)
//     - content?: string/template (the string or template for the content, componentProps is prioritised)
//     - component?: Component (the content component to show as the item, this is prioritised before content)
//     - componentProps?: Component props (the props to pass to the component, the orderNr is passed to the props)
//   }
// ]
// @TODO: - onChange?: function(list, this) (when an order changes, the onChange callback is called)
// - disabled?: boolean (whether the whole list is disabled or not, default false)
// - createOrderNumbers?: boolean (whether to create missing and repair duplicate orderNr indexes or not, will mutate the list, default false)
// - addStylesToHead?: boolean (whether to add basic CSS styles to document head, default true)
class InputDraggableList extends Component {
  constructor(props) {
    super(props);
    if (props.addStylesToHead !== false) addStylesToHead();
  }

  paint = (props) => {
    if (!props.list) {
      console.error('InputDraggableList has to have a list prop, ID: ', this.id);
      throw new Error('list prop missing');
    }
    this.list = props.list;
    this.createOrderNumbers = props.createOrderNumbers || false;
    if (this.createOrderNumbers) this.createOrder(this.list);
    this.disabled = props.disabled || false;
  };

  createOrder = (list) => {
    // @TODO: implement ordering
  };
}

let stylesAdded = false;
export const addStylesToHead = () => {
  if (stylesAdded) return;
  const css = ``;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  stylesAdded = true;
};

export default InputDraggableList;
