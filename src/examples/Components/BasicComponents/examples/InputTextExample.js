const InputTextExample = (parent, InputText) => {
  const attachId = 'examples';
  const commonProps = {
    attachId,
    onChange: (e, value) => console.log(e, value),
  };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  const inputElem1 = parent
    .add(
      new InputText({
        ...commonProps,
        label: 'Label',
        maxlength: 5,
        focusOnFirstDraw: true,
        onChange: (_, value) => {
          if (value) {
            inputElem1.clearErrors();
            return;
          }
          inputElem1.showError('Required');
        },
      })
    )
    .draw();
  inputElem1.showError('Required');
  parent.add(breakProps).draw();
  parent.add(new InputText({ ...commonProps, label: 'With value', value: 'some text' })).draw();
  parent.add(breakProps).draw();
  parent
    .add(new InputText({ ...commonProps, label: 'Password', password: true, value: 'password' }))
    .draw();
  parent.add(breakProps).draw();
  parent
    .add(new InputText({ ...commonProps, label: 'Disabled', value: 'some text', disabled: true }))
    .draw();
  parent.add(breakProps).draw();
  parent
    .add(new InputText({ ...commonProps, label: 'Multiline', value: 'some text', multiline: true }))
    .draw();
};

export default InputTextExample;
