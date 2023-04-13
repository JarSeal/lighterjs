const InputTextExample = (parent, InputText) => {
  const attachId = 'examples';
  const commonProps = {
    attachId,
    onChange: (e, value) => console.log(e, value),
  };
  const inputElem1 = parent
    .add(
      new InputText({
        ...commonProps,
        label: 'Label',
        maxlength: 5,
        focusOnFirstDraw: true,
        onChange: (_, value) => {
          if (value) {
            inputElem1.noErrors();
            return;
          }
          inputElem1.showError('Required');
        },
      })
    )
    .draw();
  inputElem1.showError('Required');
  parent.add({ attachId, attributes: { style: 'height: 30px;' } }).draw();
  parent.add(new InputText({ ...commonProps, label: 'With value', value: 'some text' })).draw();
  parent.add({ attachId, attributes: { style: 'height: 30px;' } }).draw();
  parent
    .add(new InputText({ ...commonProps, label: 'Password', password: true, value: 'password' }))
    .draw();
  parent.add({ attachId, attributes: { style: 'height: 30px;' } }).draw();
  parent
    .add(new InputText({ ...commonProps, label: 'Disabled', value: 'some text', disabled: true }))
    .draw();
};

export default InputTextExample;
