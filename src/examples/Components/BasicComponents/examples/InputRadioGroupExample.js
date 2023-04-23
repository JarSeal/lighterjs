const InputRadioGroupExample = (parent, InputRadioGroup) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const options1 = [
    { value: 0, label: 'Option 1' },
    { value: 1, label: 'Option 2' },
    { value: 2, label: 'Option 3' },
  ];

  const options2 = [
    { value: 0, label: 'Option 1' },
    { value: 1, label: 'Option 2', disabled: true },
    { value: 2, label: 'Option 3' },
  ];

  parent.addDraw(
    new InputRadioGroup({
      attachId,
      label: 'Radio group 1 with autofocus on the first input',
      options: options1,
      value: 1,
      focusOnFirstDraw: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputRadioGroup({
      attachId,
      label: 'Radio group 2 with the whole group disabled',
      options: options2,
      value: 0,
      disabled: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputRadioGroup({
      attachId,
      label: 'Radio group 3 with one input disabled',
      options: options2,
      value: 0,
      onChange: (e, compo, option) => console.log('Changed to value:', compo.value, e, option),
    })
  );
};

export default InputRadioGroupExample;
