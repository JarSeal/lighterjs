import { Component } from '../../../../Lighter';
import Button from '../Button';
import { useDialog } from '../Dialog';

const DialogExample = (parent, Dialog) => {
  if (useDialog('dialogId')) useDialog('dialogId').removeRef();
  const attachId = 'examples';
  // document.getElementById('examples').style.minHeight = '500px';

  parent.add(new Dialog({ attachId: 'root', id: 'dialogId', inlineStyles: true })).draw();

  parent
    .add(
      new Button({
        text: 'Dialog with text',
        attachId,
        onClick: () =>
          useDialog().show({
            component: Component,
            props: { text: 'This is a dialog with just text and a title.' },
            title: 'My title',
          }),
      })
    )
    .draw();
};

export default DialogExample;
