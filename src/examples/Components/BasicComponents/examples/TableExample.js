const TableExample = (parent, Table) => {
  const attachId = 'examples';
  const commonProps = { attachId, basicStyles: true };
  const breakProps = { ...commonProps, attributes: { style: 'height: 30px;' } };

  // Two col HTML table
  const table1 = [
    { row: [{ cell: 'Name', isTh: true }, { cell: 'John Doe' }] },
    { row: [{ cell: 'Speed', isTh: true }, { cell: 'Very fast' }] },
    { row: [{ cell: 'Age', isTh: true }, { cell: 'Oldish' }] },
  ];
  parent.add(new Table({ ...commonProps, rows: table1 })).draw();
  parent.add({ ...breakProps }).draw();

  // Five col HTML table
  const table2Headings = [
    { cell: 'This' },
    { cell: 'is', classes: ['JustAClass'] },
    { cell: 'a' },
    { cell: 'HTML' },
    { cell: 'table' },
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

  // Five col DIV table
  const table3Headings = [
    { cell: 'This' },
    { cell: 'is', classes: ['JustAClass'] },
    { cell: 'a' },
    { cell: 'DIV' },
    { cell: 'table' },
  ];
  parent
    .add(
      new Table({
        ...commonProps,
        isDivsTable: true,
        headings: table3Headings,
        rows: table2,
        footers: table2Footers,
      })
    )
    .draw();
  parent.add({ ...breakProps }).draw();

  // Five col HTML table with different widths
  const table4Headings = [
    { cell: 'Different' },
    { cell: 'widths', classes: ['JustAClass'] },
    { cell: 'for' },
    { cell: 'all' },
    { cell: 'HTML table columns' },
  ];
  const columnWidths = ['200px', '250px', '180px', '220px', '320px'];
  parent
    .add(
      new Table({
        ...commonProps,
        headings: table4Headings,
        rows: table2,
        footers: table2Footers,
        columnWidths,
      })
    )
    .draw();
  parent.add({ ...breakProps }).draw();

  // Five col DIV table with different widths
  const table5Headings = table4Headings.map((h, i) =>
    i === 4 ? { cell: 'DIV table columns' } : h
  );
  parent
    .add(
      new Table({
        ...commonProps,
        isDivsTable: true,
        headings: table5Headings,
        rows: table2,
        footers: table2Footers,
        columnWidths,
      })
    )
    .draw();
};

export default TableExample;
