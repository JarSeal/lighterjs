const TableExample = (parent, Table) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  const table1Headings = [
    { cell: 'Column 1' },
    { cell: 'Column 2' },
    { cell: 'Column 3' },
    { cell: 'Column 4' },
    { cell: 'Column 5' },
  ];
  const table1 = [
    {
      row: [
        { cell: 'Some content 1' },
        { cell: 'Some content 2' },
        { cell: 'Some content 3' },
        { cell: 'Some content 4' },
        { cell: 'Some content 5' },
      ],
    },
    {
      row: [
        { cell: 'Some other content 1' },
        { cell: 'Some other content 2' },
        { cell: 'Some other content 3' },
        { cell: 'Some other content 4' },
        { cell: 'Some other content 5' },
      ],
    },
  ];
  parent.add({ ...commonProps, headings: table1Headings, rows: table1 }).draw();
};

export default TableExample;
