const MenuTreeExample = (parent, MenuTree) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const menuTree1 = [
    { label: 'Root item 1', link: '/' },
    { label: 'Root item 2 disabled', link: '/404', disabled: true },
  ];

  parent.addDraw(new MenuTree({ attachId, tree: menuTree1 }));
};

export default MenuTreeExample;
