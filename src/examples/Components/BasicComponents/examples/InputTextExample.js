const InputTextExample = (parent, InputText) => {
  const attachId = 'examples';
  const commonProps = {
    attachId,
    onChange: (e, value) => console.log(e, value),
  };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  const inputElem1 = parent.addDraw(
    new InputText({
      ...commonProps,
      label: 'Label',
      maxlength: 5,
      autoFocus: true,
      onChange: (_, value) => {
        if (value) {
          inputElem1.clearErrors();
          return;
        }
        inputElem1.showError('Required');
      },
    })
  );
  inputElem1.showError('Required');

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputText({
      ...commonProps,
      label: 'With value',
      value: 'some text',
      selectTextOnFocus: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputText({ ...commonProps, label: 'Password', password: true, value: 'password' })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputText({ ...commonProps, label: 'Disabled', value: 'some text', disabled: true })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputText({
      ...commonProps,
      label: 'Multiline',
      value: 'some text',
      multiline: true,
      selectTextOnFocus: true,
    })
  );
};

export default InputTextExample;
