const InputNumberExample = (parent, InputNumber) => {
  const attachId = 'examples';

  parent.addDraw(
    new InputNumber({
      attachId,
      label: 'Empty number input',
      value: 4.3,
      autoFocus: true,
      selectTextOnFocus: true,
    })
  );
};

export default InputNumberExample;
