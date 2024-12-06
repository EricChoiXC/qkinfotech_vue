export default {

  name: 'group2',

  menu: [
    {
      id: 'app1',
      label: 'app1-label',
      icon: 'app1-icon',
      parent: 'group2',
      visible: () => {
        return true;
      },
    },

  ]

}
