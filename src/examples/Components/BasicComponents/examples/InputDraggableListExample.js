const InputDraggableListExample = (parent, InputDraggableList) => {
  const attachId = 'examples';
  // const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const simpleList = [
    { content: 'List item 1' },
    { content: 'List item 2' },
    { content: 'List item 3' },
  ];

  parent.addDraw(new InputDraggableList({ attachId, list: simpleList }));
};

export default InputDraggableListExample;
