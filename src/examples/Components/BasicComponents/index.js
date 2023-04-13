import Button from './Button';
import ButtonCode from './Button?raw';
import ToolTip from './ToolTip';
import ToolTipCode from './ToolTip?raw';

let buttonClickCounter = 0;

export const componentsList = [
  {
    id: 'button',
    name: 'Button',
    component: Button,
    code: ButtonCode,
    examples: (parent, Button) => {
      parent
        .add(
          new Button({
            text: 'Button',
            attachId: 'examples',
            onClick: (e) => {
              buttonClickCounter++;
              console.log('Button clicked: ' + buttonClickCounter, e);
              parent.elem.querySelector('#examples').innerHTML = '';
              parent.componentInfo.examples(parent, Button);
            },
          })
        )
        .draw();
      parent.add({ text: 'Button clicks: ' + buttonClickCounter, attachId: 'examples' }).draw();
    },
  },
  {
    id: 'tooltip',
    name: 'ToolTip',
    component: ToolTip,
    code: ToolTipCode,
    examples: (parent, ToolTip) => {
      parent
        .add(
          new ToolTip({
            attachId: 'examples',
            icon: 'Info',
            content: 'My tip to you!',
            basicPopupStyles: true,
          })
        )
        .draw();
    },
  },
];

export default { Button };
