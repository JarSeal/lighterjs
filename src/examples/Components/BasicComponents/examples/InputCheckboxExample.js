const InputCheckboxExample = (parent, InputCheckbox) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  parent.addDraw(
    new InputCheckbox({ ...commonProps, label: 'Checked', value: true, autoFocus: true })
  );

  parent.addDraw(breakProps);
  parent.addDraw(new InputCheckbox({ ...commonProps, label: 'Unchecked' }));

  parent.addDraw(breakProps);
  parent.addDraw(new InputCheckbox({ ...commonProps, label: 'Disabled', disabled: true }));

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputCheckbox({
      ...commonProps,
      label: 'If you change this..',
      onChange: (_, value) => {
        checkCompo.toggle(value);
      },
    })
  );

  parent.addDraw(breakProps);
  const checkCompo = parent.addDraw(
    new InputCheckbox({ ...commonProps, label: '..this one changes as well' })
  );
};

export default InputCheckboxExample;
