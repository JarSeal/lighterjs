const CollapsableSectionExample = (parent, CollapsableSection) => {
  const attachId = 'examples';
  const commonProps = { attachId, inlineStyles: true };
  const breakProps = { ...commonProps, attributes: { style: 'height: 30px;' } };

  parent.add(new CollapsableSection({ ...commonProps, title: 'My section' })).draw();
};

export default CollapsableSectionExample;
