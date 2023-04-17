const TableExample = (parent, Table) => {
  const attachId = 'examples';
  const commonProps = { attachId, alignTextLeft: true };
  const breakProps = { ...commonProps, attributes: { style: 'height: 30px;' } };
  const table1 = [
    { row: [{ cell: 'Name', isTh: true }, { cell: 'John Doe' }] },
    { row: [{ cell: 'Speed', isTh: true }, { cell: 'Very fast' }] },
    { row: [{ cell: 'Age', isTh: true }, { cell: 'Oldish' }] },
  ];
  parent.add(new Table({ ...commonProps, rows: table1 })).draw();
  parent.add({ ...breakProps }).draw();
  const table2Headings = [
    { cell: 'Column 1' },
    { cell: 'Column 2', classes: ['JustAClass'] },
    { cell: 'Column 3' },
    { cell: 'Column 4' },
    { cell: 'Column 5' },
  ];
  const table2 = [
    {
      classes: ['tuut'],
      row: [
        { cell: 'Some content 1' },
        { cell: 'Some content 2' },
        { cell: 'Some content 3', classes: ['oneClass', 'justAClass'] },
        { cell: 'Some content 4', id: 'myId' },
        { cell: 'Some content 5' },
      ],
    },
    {
      id: 'ouYeah',
      row: [
        { cell: 'Some other content 1' },
        { cell: 'Some other content 2' },
        { cell: 'Some other content 3' },
        { cell: 'Some other content 4' },
        { cell: 'Some other content 5' },
      ],
    },
  ];
  const table2Footers = [{ cell: 'Table footer spanning 5 columns', colSpan: 5, isTh: true }];
  parent
    .add(
      new Table({ ...commonProps, headings: table2Headings, rows: table2, footers: table2Footers })
    )
    .draw();
  parent.add({ ...breakProps }).draw();
  parent
    .add(
      new Table({
        ...commonProps,
        isDivsTable: true,
        headings: table2Headings,
        rows: table2,
        footers: table2Footers,
      })
    )
    .draw();
};

export default TableExample;
