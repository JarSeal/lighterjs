const InputDropdownExample = (parent, InputDropdown) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  parent.add(new InputDropdown({ ...commonProps, text: 'YYH' })).draw();
};

export default InputDropdownExample;
