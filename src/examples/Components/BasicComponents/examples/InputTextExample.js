const InputTextExample = (parent, InputText) => {
  const attachId = 'examples';
  const commonProps = {
    attachId,
    onChange: (e, value) => console.log(e, value),
  };
  parent.add(new InputText({ ...commonProps, label: 'Label', maxlength: '3' })).draw();
  parent.add({ attachId, attributes: { style: 'height: 30px;' } }).draw();
  parent.add(new InputText({ ...commonProps, label: 'Label', value: 'some text' })).draw();
};

export default InputTextExample;
