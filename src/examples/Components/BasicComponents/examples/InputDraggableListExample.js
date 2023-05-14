const InputDraggableListExample = (parent, InputDraggableList) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const simpleList1 = [
    { template: 'List item 1' },
    { template: 'List item 2', orderNr: 1 },
    { template: 'List item 3', orderNr: 0 },
    { template: 'List item 4 <button>A button</button>' },
    { template: 'List item 5 <input type="text" />', orderNr: 2 },
  ];

  const simpleList2 = [
    { template: 'List item 6' },
    { template: 'List item 7', orderNr: 1 },
    { template: 'List item 8', orderNr: 0 },
    { template: 'List item 9' },
    { template: 'List item 10<br /><input type="text" />', orderNr: 2 },
  ];

  parent.addDraw({
    attachId,
    text: 'Simple list 1 (can be moved to Simple list 2):',
    tag: 'h3',
    style: { margin: 0 },
  });
  parent.addDraw(
    new InputDraggableList({
      attachId,
      id: 'simpleList1',
      dragToListIds: 'simpleList2',
      list: simpleList1,
      onChange: (list, compo) => console.log('onChangeFn', compo.id, list),
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw({
    attachId,
    text: 'Simple list 2 (can be moved to Simple list 1):',
    tag: 'h3',
    style: { margin: 0 },
  });
  parent.addDraw(
    new InputDraggableList({
      attachId,
      id: 'simpleList2',
      dragToListIds: 'simpleList1',
      list: simpleList2,
      style: { width: '600px' },
      onChange: (list, compo) => console.log('onChangeFn', compo.id, list),
    })
  );

  const commonComponentList = [
    { componentProps: { text: 'Component item 1' } },
    { componentProps: { text: 'Component item 2' } },
    { componentProps: { text: 'Component item 3' } },
    { componentProps: { text: 'Component item 4' } },
    { componentProps: { text: 'Component item 5' } },
  ];
  parent.addDraw(breakProps);
  parent.addDraw({ attachId, text: 'Common component list:', tag: 'h3', style: { margin: 0 } });
  parent.addDraw(
    new InputDraggableList({
      attachId,
      id: 'commonComponentList',
      list: commonComponentList,
      commonComponentProps: { style: { pointerEvents: 'none' } },
      onChange: (list, compo) => console.log('onChangeFn', compo.id, list),
    })
  );

  const simpleList3 = [
    { template: 'List item 1' },
    { template: 'List item 2' },
    { template: 'List item 3' },
    { template: 'List item 4' },
    { template: 'List item 5' },
    { template: 'List item 6' },
    { template: 'List item 7' },
    { template: 'List item 8' },
    { template: 'List item 9' },
    { template: 'List item 10' },
    { template: 'List item 11' },
    { template: 'List item 12' },
    { template: 'List item 13' },
    { template: 'List item 14' },
    { template: 'List item 15' },
    { template: 'List item 16' },
    { template: 'List item 17' },
    { template: 'List item 18' },
    { template: 'List item 19' },
    { template: 'List item 20' },
  ];
  parent.addDraw(breakProps);
  parent.addDraw({ attachId, text: 'Scrollable list:', tag: 'h3', style: { margin: 0 } });
  parent.addDraw(
    new InputDraggableList({
      attachId,
      id: 'scrollableList',
      list: simpleList3,
      style: { maxHeight: '300px', overflow: 'auto' },
      onChange: (list, compo) => console.log('onChangeFn', compo.id, list),
    })
  );
};

export default InputDraggableListExample;
