export default {

  name: 'fnc1',

  menu: {
    id: 'fnc1',
    label: 'fnc1-label',
    icon: 'fnc1-icon',
    parent: 'app1',
    visible: () => {
      return true;
    },

    children: [
      {
        id: 'fnc1',
        label: 'fnc1-label',
        icon: 'xxx',
        url: '/group1/app1/fnc1',
        component: '',
        type: 'route', // route/iframe/window
        key: 'xxx', // or fid
        visible: () => {
          return true;
        },
      },

    ]
  },

}
