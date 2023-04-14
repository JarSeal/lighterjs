const InputCheckboxExample = (parent, InputCheckbox) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  parent.add(new InputCheckbox({ ...commonProps, label: 'Checked', value: true })).draw();
  parent.add(breakProps).draw();
  parent.add(new InputCheckbox({ ...commonProps, label: 'Unchecked' })).draw();
  // parent.add(breakProps).draw();
};

export default InputCheckboxExample;
