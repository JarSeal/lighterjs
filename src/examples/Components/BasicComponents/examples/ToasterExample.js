import Button from '../Button';
import { useToaster } from '../Toaster';

const ToasterExample = (parent, Toaster) => {
  if (useToaster('toasterId')) useToaster('toasterId').removeRef();
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  parent.addDraw(new Toaster({ attachId: 'root', id: 'toasterId' }));

  parent.addDraw(
    new Button({
      text: 'Success',
      attachId,
      onClick: () =>
        useToaster().show({
          type: 'success',
          title: '<span style="color: #090;">Success</span>',
          content: 'This is a success toast',
        }),
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new Button({
      text: 'Warning',
      attachId,
      onClick: () =>
        useToaster().show({
          type: 'warning',
          title: '<span style="color: #F90;">Warning</span>',
          content: 'This is a warning toast',
        }),
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new Button({
      text: 'Error (no timeout)',
      attachId,
      onClick: () =>
        useToaster().show({
          type: 'error',
          title: '<span style="color: #E00;">Error</span>',
          content: 'This is an error toast',
        }),
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new Button({
      text: 'Info',
      attachId,
      onClick: () =>
        useToaster().show({
          type: 'success',
          title: '<span style="color: #099;">Info</span>',
          content: 'This is an info toast',
        }),
    })
  );
};

export default ToasterExample;
