const ToolTipExample = (parent, ToolTip) => {
  const commonProps = {
    attachId: 'examples',
    inlineStyles: true,
  };
  parent
    .add(
      new ToolTip({
        ...commonProps,
        icon: 'Left-top',
        content: 'My tip 1 to you!',
        vertAlign: 'top',
      })
    )
    .draw();
  parent
    .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
    .draw();
  parent
    .add(
      new ToolTip({
        ...commonProps,
        icon: 'Center-top',
        content: 'My tip 2 to you!',
        vertAlign: 'top',
        horiAlign: 'center',
      })
    )
    .draw();
  parent
    .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
    .draw();
  parent
    .add(
      new ToolTip({
        ...commonProps,
        icon: 'Right-top',
        content: 'My tip 3 to you!',
        vertAlign: 'top',
        horiAlign: 'right',
      })
    )
    .draw();
  parent.add({ attachId: 'examples', attributes: { style: 'height: 30px;' } }).draw();
  parent
    .add(
      new ToolTip({
        ...commonProps,
        icon: 'Left-bottom',
        content: 'My tip 4 to you!',
      })
    )
    .draw();
  parent
    .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
    .draw();
  parent
    .add(
      new ToolTip({
        ...commonProps,
        icon: 'Center-bottom',
        content: 'My tip 5 to you!',
        horiAlign: 'center',
      })
    )
    .draw();
  parent
    .add({ attachId: 'examples', attributes: { style: 'width: 50px; display: inline-block;' } })
    .draw();
  parent
    .add(
      new ToolTip({
        ...commonProps,
        icon: 'Right-bottom',
        content: 'My tip 6 to you! And this tip is a long one!',
        horiAlign: 'right',
      })
    )
    .draw();
};

export default ToolTipExample;
