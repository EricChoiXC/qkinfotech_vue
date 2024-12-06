export default {

  name: 'group1',

  menu: [
    {
      id: 'app1',
      label: 'app1-label',
      icon: 'app1-icon',
      parent: 'group1',
      visible: () => {
        return true;
      },
    },

  ]

}
