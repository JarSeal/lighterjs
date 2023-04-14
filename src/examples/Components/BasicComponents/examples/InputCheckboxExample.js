const InputCheckboxExample = (parent, InputCheckbox) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  parent.add(new InputCheckbox({ ...commonProps, label: 'Checked', value: true })).draw();
  parent.add(breakProps).draw();
  parent.add(new InputCheckbox({ ...commonProps, label: 'Unchecked' })).draw();
  parent.add(breakProps).draw();
  parent.add(new InputCheckbox({ ...commonProps, label: 'Disabled', disabled: true })).draw();
  parent.add(breakProps).draw();
  parent
    .add(
      new InputCheckbox({
        ...commonProps,
        label: 'If you change this..',
        onChange: (_, value) => {
          checkCompo.toggle(value);
        },
      })
    )
    .draw();
  parent.add(breakProps).draw();
  const checkCompo = parent
    .add(new InputCheckbox({ ...commonProps, label: '..this one changes as well' }))
    .draw();
};

export default InputCheckboxExample;
