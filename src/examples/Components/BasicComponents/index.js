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
      const toolTipProps = {
        attachId: 'examples',
        basicPopupStyles: true,
      };
      parent
        .add(
          new ToolTip({
            ...toolTipProps,
            icon: 'Left-top',
            content: 'My tip 1 to you!',
            vertAlign: 'top',
          })
        )
        .draw();
      parent
        .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
        .draw();
      parent
        .add(
          new ToolTip({
            ...toolTipProps,
            icon: 'Center-top',
            content: 'My tip 2 to you!',
            vertAlign: 'top',
            horiAlign: 'center',
          })
        )
        .draw();
      parent
        .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
        .draw();
      parent
        .add(
          new ToolTip({
            ...toolTipProps,
            icon: 'Right-top',
            content: 'My tip 3 to you!',
            vertAlign: 'top',
            horiAlign: 'right',
          })
        )
        .draw();
      parent.add({ attachId: 'examples', attributes: { style: 'height: 30px;' } }).draw();
      parent
        .add(
          new ToolTip({
            ...toolTipProps,
            icon: 'Left-bottom',
            content: 'My tip 4 to you!',
          })
        )
        .draw();
      parent
        .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
        .draw();
      parent
        .add(
          new ToolTip({
            ...toolTipProps,
            icon: 'Center-bottom',
            content: 'My tip 5 to you!',
            horiAlign: 'center',
          })
        )
        .draw();
      parent
        .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
        .draw();
      parent
        .add(
          new ToolTip({
            ...toolTipProps,
            icon: 'Right-bottom',
            content: 'My tip 6 to you! And this tip is a long one!',
            horiAlign: 'right',
          })
        )
        .draw();
    },
  },
];

export default { Button };
