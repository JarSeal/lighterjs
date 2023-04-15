const InputDropdownExample = (parent, InputDropdown) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  const options1 = [
    { value: 1, text: 'First choice' },
    { value: 2, text: 'Second choice' },
    { value: 3, text: 'Third choice' },
    { value: 4, text: 'Fourth choice' },
    { value: 5, text: 'Fifth choice' },
  ];
  const options2 = [
    {
      label: 'Group 1',
      group: [
        { value: 1, text: 'First choice' },
        { value: 2, text: 'Second choice' },
        { value: 3, text: 'Third choice' },
        { value: 4, text: 'Fourth choice' },
        { value: 5, text: 'Fifth choice' },
      ],
    },
    {
      label: 'Group 2',
      group: [
        { value: 6, text: 'Sixth choice' },
        { value: 7, text: 'Seventh choice' },
        { value: 8, text: 'Eight choice' },
        { value: 9, text: 'Ninth choice' },
        { value: 10, text: 'Tenth choice' },
      ],
    },
  ];
  parent
    .add(new InputDropdown({ ...commonProps, options: options1, value: 3, label: 'Label' }))
    .draw();
  parent.add(breakProps).draw();
  parent
    .add(
      new InputDropdown({
        ...commonProps,
        options: options1,
        value: 3,
        label: 'Disabled',
        disabled: true,
      })
    )
    .draw();
  parent.add(breakProps).draw();
  parent
    .add(
      new InputDropdown({
        ...commonProps,
        options: options2,
        value: 7,
        label: 'Grouped',
      })
    )
    .draw();
  parent.add(breakProps).draw();
  const dropdown1 = parent
    .add(
      new InputDropdown({
        ...commonProps,
        options: options1,
        value: 3,
        label: 'When this one changes...',
        onChange: (_, value) => {
          dropdown2.setValue(value);
        },
      })
    )
    .draw();
  parent.add(breakProps).draw();
  const dropdown2 = parent
    .add(
      new InputDropdown({
        ...commonProps,
        options: options1,
        value: dropdown1.value,
        label: '...so does this',
      })
    )
    .draw();
};

export default InputDropdownExample;
