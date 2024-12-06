export default {

  name: 'app1',

  menu: [
    {
      id: 'fnc1',
      label: 'fnc1-label',
      icon: 'fnc1-icon',
      parent: 'app1',
      visible: () => {
        return true;
      }
    },


  ]

}
