import { Component } from '../../../../Lighter';
import Button from '../Button';
import { useDialog } from '../Dialog';
import InputText from '../InputText';

const DialogExample = (parent, Dialog) => {
  if (useDialog('dialogId')) useDialog('dialogId').removeRef();
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  parent.add(new Dialog({ attachId: 'root', id: 'dialogId', inlineStyles: true })).draw();

  parent
    .add(
      new Button({
        text: 'Dialog with text',
        attachId,
        onClick: () =>
          useDialog().show({
            props: { text: 'This is a dialog with text, a title, and two buttons.' },
            title: 'My title',
            buttons: [
              {
                text: 'Cancel',
              },
              {
                text: 'OK',
                onClick: (e, dialog) => {
                  console.log('OK pressed', dialog);
                  dialog.close();
                },
              },
            ],
          }),
      })
    )
    .draw();
  parent.add(breakProps).draw();

  parent
    .add(
      new Button({
        text: 'Dialog with sticky buttons',
        attachId,
        onClick: () =>
          useDialog().show({
            props: { text: 'This is a dialog with text, a title, and two sticky buttons.' },
            title: 'Sticky buttons',
            hideCloseButton: true,
            outsideClickEnabled: false,
            stickyButtons: [
              {
                text: 'Cancel',
              },
              {
                text: 'OK',
                onClick: (e, dialog) => {
                  console.log('OK pressed', dialog);
                  dialog.close();
                },
              },
            ],
          }),
      })
    )
    .draw();
  parent.add(breakProps).draw();

  parent
    .add(
      new Button({
        text: 'Custom Component as Dialog',
        attachId,
        onClick: () => useDialog().show({ component: ExampleDialog }),
      })
    )
    .draw();
  parent.add(breakProps).draw();

  parent
    .add(
      new Button({
        text: 'Dialog with long content',
        attachId,
        onClick: () =>
          useDialog().show({
            props: {
              template:
                '<div style="height: 900px; position: relative;"><div>A really long content that starts here...</div><div style="position: absolute; left: 0; bottom: 0;">...and ends here.</div></div>',
            },
            title: 'My title',
            buttons: [
              {
                text: 'Cancel',
              },
              {
                text: 'OK',
                onClick: (e, dialog) => {
                  console.log('OK pressed', dialog);
                  dialog.close();
                },
              },
            ],
          }),
      })
    )
    .draw();
};

class ExampleDialog extends Component {
  constructor(props) {
    super(props);
    this.dialog = useDialog();
    this.dialog.promptOnClose = true;
    this.dialog.title = 'My custom component';
    this.dialog.outsideClickEnabled = false;
  }

  paint = () => {
    this.add({
      text: 'Making changes to the input field will prompt the user when the dialog is closed.',
    }).draw();
    this.add(new InputText({ onChange: () => (this.dialog.hasChanges = true) })).draw();
  };
}

export default DialogExample;
