const ToolTipExample = (parent, ToolTip) => {
  const commonProps = {
    attachId: 'examples',
    inlineStyles: true,
  };
  parent.addDraw(
    new ToolTip({
      ...commonProps,
      icon: 'Left-top',
      content: 'My tip 1 to you!',
      vertAlign: 'top',
    })
  );
  parent.addDraw({
    attachId: 'examples',
    attributes: { style: 'width: 50px; display: inline-block;' },
  });
  parent.addDraw(
    new ToolTip({
      ...commonProps,
      icon: 'Center-top',
      content: 'My tip 2 to you!',
      vertAlign: 'top',
      horiAlign: 'center',
    })
  );
  parent.addDraw({
    attachId: 'examples',
    attributes: { style: 'width: 50px; display: inline-block;' },
  });
  parent.addDraw(
    new ToolTip({
      ...commonProps,
      icon: 'Right-top',
      content: 'My tip 3 to you!',
      vertAlign: 'top',
      horiAlign: 'right',
    })
  );

  parent.addDraw({ attachId: 'examples', attributes: { style: 'height: 30px;' } });

  parent.addDraw(
    new ToolTip({
      ...commonProps,
      icon: 'Left-bottom',
      content: 'My tip 4 to you!',
    })
  );
  parent.addDraw({
    attachId: 'examples',
    attributes: { style: 'width: 50px; display: inline-block;' },
  });
  parent.addDraw(
    new ToolTip({
      ...commonProps,
      icon: 'Center-bottom',
      content: 'My tip 5 to you!',
      horiAlign: 'center',
    })
  );
  parent.addDraw({
    attachId: 'examples',
    attributes: { style: 'width: 50px; display: inline-block;' },
  });
  parent.addDraw(
    new ToolTip({
      ...commonProps,
      icon: 'Right-bottom',
      content: 'My tip 6 to you! And this tip is a long one!',
      horiAlign: 'right',
    })
  );
};

export default ToolTipExample;
