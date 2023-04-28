const InputNumberExample = (parent, InputNumber) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Focused and selected input',
      value: 4.3,
      autoFocus: true,
      selectTextOnFocus: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Step by 0,1 input',
      value: 4.3,
      step: 0.1,
      maxlength: 4,
    })
  );
};

export default InputNumberExample;
