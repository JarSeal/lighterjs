const InputNumberExample = (parent, InputNumber) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Focused and selected input',
      value: 4,
      autoFocus: true,
      selectTextOnFocus: true,
      onBlur: () => console.log('here'),
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Step by 0,1 input',
      value: 4.3,
      step: 0.1,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Precision 2 decimals, step by 0,003',
      value: 4.3,
      step: 0.003,
      precision: 2,
    })
  );
};

export default InputNumberExample;
