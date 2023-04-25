const MenuTreeExample = (parent, MenuTree) => {
  const attachId = 'examples';
  const breakProps = { attachId, attributes: { style: 'height: 30px;' } };

  const menuTree1 = [
    { label: 'Root item 1', link: '/' },
    { label: 'Root item 2 disabled', link: '/404', disabled: true },
  ];
  const menuTree2 = [
    { label: 'Level 1 item 1', onClick: (e, item) => console.log('Click Root item 1', e, item) },
    {
      label: 'Level 1 item 2',
      tree: [
        { label: 'Level 2 item 1' },
        {
          label: 'Level 2 item 2 (disabled onClick)',
          disabled: true,
          onClick: (e, item) => console.log('Click should not happen', e, item),
        },
        { label: 'Level 2 item 3', link: '/' },
        {
          label: 'Level 2 item 4',
          link: '/',
          onClick: (e, item) => console.log('Click Level 2 item 4', e, item),
        },
      ],
    },
    {
      label: 'Level 1 item 3 (whole sub tree disabled)',
      onClick: (e, item) => console.log('Click Root item 3', e, item),
      disabled: true,
      tree: [{ label: 'Disabled because parent is', link: '/' }],
    },
    {
      label: 'Level 1 item 4',
      onClick: (e, item) => console.log('Click Root item 4', e, item),
      tree: [
        { label: 'Level 2 item 1 (disabled link)', link: '/', disabled: true },
        {
          label: 'Level 2 item 1',
          tree: [
            { label: 'Level 3 item 1' },
            {
              label: 'Level 3 item 2',
              link: '/',
              onClick: (e, item) => console.log('Click and link', e, item),
            },
            {
              label: 'Level 3 item 3',
              tree: [
                {
                  label: 'Level 4 item 1 (outside link)',
                  link: 'https://www.google.com',
                  target: '_blank',
                },
                { label: 'Level 4 item 2 (routeLink)', routeLink: '/basic-components' },
              ],
            },
          ],
        },
      ],
    },
  ];

  parent.addDraw(new MenuTree({ attachId, tree: menuTree1 }));

  parent.addDraw(breakProps);
  parent.addDraw(new MenuTree({ attachId, tree: menuTree2 }));
};

export default MenuTreeExample;
