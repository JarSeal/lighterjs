const InputDraggableListExample = (parent, InputDraggableList) => {
  const attachId = 'examples';
  // const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const simpleList = [
    { content: 'List item 1' },
    { content: 'List item 2', orderNr: 1 },
    { content: 'List item 3', orderNr: 0 },
    { content: 'List item 4' },
    { content: 'List item 5 <input type="text" />', orderNr: 2 },
  ];

  parent.addDraw(
    new InputDraggableList({
      attachId,
      list: simpleList,
      createOrderNumbers: false,
      onChange: (list) => console.log(list),
    })
  );
};

export default InputDraggableListExample;
