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

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Precision 2 decimals, step by 0,003, can have no value',
      step: 0.003,
      precision: 2,
      canBeNull: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Min is 2 and max is 4',
      value: 3,
      min: 2,
      max: 4,
      canBeNull: true,
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Custom buttons',
      value: 3,
      min: -10,
      max: 10,
      useCustomButtons: true,
    })
  );
};

export default InputNumberExample;
