const CollapsableSectionExample = (parent, CollapsableSection) => {
  const attachId = 'examples';
  const commonProps = { attachId, inlineStyles: true };
  const breakProps = { ...commonProps, attributes: { style: 'height: 30px;' } };

  parent.addDraw(
    new CollapsableSection({
      ...commonProps,
      title: 'Section 1',
      isOpen: false,
      contentProps: { template: '<div>My stuff 1<br />My stuff 2<br />My stuff 3</div>' },
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new CollapsableSection({
      ...commonProps,
      title: 'Open section 2',
      isOpen: false,
      contentProps: { text: 'my stuff' },
      afterToggle: (comp) => {
        comp.updateTitle(comp.isOpen ? 'Close section 2' : 'Open section 2');
      },
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new CollapsableSection({
      ...commonProps,
      title: 'Section 3',
      isOpen: true,
      contentProps: { template: '<div>My stuff 1<br />My stuff 2<br />My stuff 3</div>' },
    })
  );

  parent.addDraw(breakProps);
  parent.addDraw(
    new CollapsableSection({
      ...commonProps,
      title: 'Section 4 opens upwards and is slower',
      isOpen: false,
      animTime: [1200, 1800],
      opensUp: true,
      contentProps: { template: '<div>My stuff 1<br />My stuff 2<br />My stuff 3</div>' },
    })
  );
};

export default CollapsableSectionExample;
