const InputDraggableListExample = (parent, InputDraggableList) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const simpleList1 = [
    { content: 'List item 1' },
    { content: 'List item 2', orderNr: 1 },
    { content: 'List item 3', orderNr: 0 },
    { content: 'List item 4 <button>A button</button>' },
    { content: 'List item 5 <input type="text" />', orderNr: 2 },
  ];

  const simpleList2 = [
    { content: 'List item 6' },
    { content: 'List item 7', orderNr: 1 },
    { content: 'List item 8', orderNr: 0 },
    { content: 'List item 9' },
    { content: 'List item 10<br /><input type="text" />', orderNr: 2 },
  ];

  parent.addDraw({ attachId, text: 'Simple list 1:', tag: 'h3', style: { margin: 0 } });
  parent.addDraw(
    new InputDraggableList({
      attachId,
      id: 'simpleList1',
      dragToListIds: 'simpleList2',
      list: simpleList1,
      onChange: (list, compo) => console.log(compo.id, list),
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw({ attachId, text: 'Simple list 2:', tag: 'h3', style: { margin: 0 } });
  parent.addDraw(
    new InputDraggableList({
      attachId,
      id: 'simpleList2',
      dragToListIds: 'simpleList1',
      list: simpleList2,
      onChange: (list, compo) => console.log(compo.id, list),
    })
  );
};

export default InputDraggableListExample;
