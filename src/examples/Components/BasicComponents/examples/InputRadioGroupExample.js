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

  //parent.add({ attachId, text: 'THISIHFGSHIFHSI' }).draw();

  parent.addDraw(
    new InputRadioGroup({ attachId, label: 'Radio group 1', options: options1, value: 0 })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputRadioGroup({
      attachId,
      label: 'Radio group 2',
      options: options2,
      value: 0,
      disabled: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputRadioGroup({ attachId, label: 'Radio group 3', options: options2, value: 0 })
  );
};

export default InputRadioGroupExample;
