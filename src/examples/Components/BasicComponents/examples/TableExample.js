const TableExample = (parent, Table) => {
  const attachId = 'examples';
  const commonProps = { attachId };
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };
  parent.add({ ...commonProps, text: 'WHY?' }).draw();
};

export default TableExample;
