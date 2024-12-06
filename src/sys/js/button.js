import {
  h,
  ref
} from 'vue'
import {
  NButton,
  NIcon,
} from 'naive-ui'
import {
  CashOutline as CashIcon
} from '@vicons/ionicons5'
import {
  InformationCircleOutline as InfoIcon
} from '@vicons/ionicons5'
import {
  TrashOutline as TrashIcon
} from '@vicons/ionicons5'
import {
  PencilOutline as PencilIcon
} from '@vicons/ionicons5'


export const useTableDate = ({
  props,
  colums,
  buttons,
  actions
}) => {
  const renderActionColumn = (viewItem, editItem, deleteItem) => (row, index) => {
    //默认按钮参数
    const defaultButton = {
      'view': {
        label: "view",
        hidden: false,
        strong: true,
        tertiary: true,
        size: 'small',
        detail: false,
        onClick: () => actions.viewItem(row),
        icon: InfoIcon
      },
      'edit': {
        label: "edit",
        hidden: false,
        strong: true,
        tertiary: true,
        size: 'small',
        detail: false,
        onClick: () => actions.editItem(row),
        icon: PencilIcon
      },
      'delete': {
        label: "del",
        hidden: false,
        strong: true,
        tertiary: true,
        size: 'small',
        detail: false,
        onClick: () => actions.deleteItem(row),
        icon: TrashIcon
      },
      'view1': {
        label: "view1",
        hidden: false,
        strong: true,
        tertiary: true,
        size: 'small',
        detail: false,
        onClick: () => actions.viewItem(row),
        icon: InfoIcon
      },
    }

    const resultArr = [];
    buttons.forEach(function(item, index) {
      if (typeof(item.button) === 'string') {
        if (defaultButton[item.button]) {
          const obj = Object.assign({}, defaultButton[item.button], item.props);
          resultArr.push(makebutton(obj, row))
        }
      } else {
        if (typeof item === 'object') {
          const keys = Object.keys(item);
          keys.forEach(key => {
            if (defaultButton[key]) {
              const obj = Object.assign({}, defaultButton[key], item[key]);
              resultArr.push(makebutton(obj))
            } else {
              resultArr.push(makebutton(item[key]))
            }
          });
        }
      }
    })

    // const resultArr = [
    // h(
    //   NButton, {
    //     strong: true,
    //     tertiary: true,
    //     size: 'small',
    //     onClick: () => viewItem(row),
    //     hidden: false
    //   },
    //   [h(
    //     NIcon,
    //     null,
    //     h(InfoIcon),
    //   ), 'View']
    // ),
    // h(
    //   NButton, {
    //     strong: true,
    //     tertiary: true,
    //     size: 'small',
    //     onClick: () => editItem(row),
    //     hidden: false
    //   },
    //   [h(
    //     NIcon,
    //     null,
    //     h(PencilIcon)
    //   ), 'Edit']
    // ),
    // h(
    //   NButton, {
    //     strong: true,
    //     tertiary: true,
    //     size: 'small',
    //     onClick: () => deleteItem(row, index),
    //     hidden: false
    //   },
    //   [
    //     h(
    //       NIcon,
    //       null,
    //       h(TrashIcon)
    //     ),
    //     'Delete',
    //   ]
    // ),
    // ];
    return resultArr
  };


  const makebutton = (item, row) => {
    const result = h(
      NButton, {
        strong: item.strong ? item.strong : true,
        tertiary: item.tertiary ? item.tertiary : true,
        size: item.size ? item.size : 'small',
        onClick: item.onClick ? () => item.onClick(row) : () => {},
        hidden: item.hidden ? item.hidden : false
      },
      [h(
        NIcon,
        null,
        h(item.icon),
      ), item.label]
    )
    return result;
  }


  const createColumns = ({
    viewItem,
    editItem,
    deleteItem
  }) => [{
    type: 'selection',
    width: 50
  },
  {
    title: '重要性',
    key: 'fName'
  },
  {
    title: '创建人',
    key: 'fCreator'
  }, {
    title: '创建时间',
    key: 'fCreateTime'
  },{
      title: 'Action',
      key: 'actions',
      width: 240,
      render: renderActionColumn(viewItem, editItem, deleteItem) // 使用公共函数
    }
  ]
  const columns = createColumns(actions.viewItem, actions.editItem, actions.deleteItem)
  return {
    columns,
  }
}
