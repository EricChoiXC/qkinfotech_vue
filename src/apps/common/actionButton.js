import {
  h,
  ref
} from 'vue'
import {
  NButton,
  NIcon,
  useDialog
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

const dialog = useDialog()
const renderActionColumn = (viewItem, editItem, deleteItem) => (row, index) => {

  const resultArr = [
    h(
      NButton, {
        strong: true,
        tertiary: true,
        size: 'small',
        onClick: () => viewItem(row)
      },
      [h(
        NIcon,
        null,
        h(InfoIcon),
      ), 'View']
    ),
    h(
      NButton, {
        strong: true,
        tertiary: true,
        size: 'small',
        onClick: () => editItem(row)
      },
      [h(
        NIcon,
        null,
        h(PencilIcon)
      ), 'Edit']
    ), h(
      NButton, {
        strong: true,
        tertiary: true,
        size: 'small',
        onClick: () => {
          dialog.warning({
            content: '是否要删除改数据',
            positiveText: '确认',
            negativeText: '取消',
            onPositiveClick: function(){
              deleteItem(row, index)
            }
          })
        },
      },
      [
        h(
          NIcon,
          null,
          h(TrashIcon)
        ),
        'Delete',
      ]
    ),
  ];

  return resultArr

};

export default renderActionColumn

export const useTableDate = ({
  showModal, //查看编辑的弹窗是否显示
  method, //查看view还是编辑edit
  rowdata, //单行数据
  data, //data数据
  columsName, //列名
  deleteCall = undefined,  //删除数据回调函数
}) => {
  const renderActionColumn = (viewItem, editItem, deleteItem) => (row, index) => {
    const dialog = useDialog()

    const resultArr = [
      h(
        NButton, {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => viewItem(row)
        },
        [h(
          NIcon,
          null,
          h(InfoIcon),
        ), 'View']
      ),
      h(
        NButton, {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => editItem(row)
        },
        [h(
          NIcon,
          null,
          h(PencilIcon)
        ), 'Edit']
      ), h(
        NButton, {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () =>  {
            dialog.warning({
              content:'是否删除改数据？',
              positiveText:'确认',
              negativeText: '取消',
              onPositiveClick: function(){
                if(deleteCall === undefined) {
                  return deleteItem(row, index);
                }
                data.value.splice(index, 1);
                return deleteCall(row);
              }
            })
          },
        },
        [
          h(
            NIcon,
            null,
            h(TrashIcon)
          ),
          'Delete',
        ]
      ),
    ];

    return resultArr

  };


  const createColumns = ({
    viewItem,
    editItem,
    deleteItem
  }) => [
    ...columsName,
    {
      title: 'Action',
      key: 'actions',
      width: 240,
      render: renderActionColumn(viewItem, editItem, deleteItem) // 使用公共函数
    }
  ]

  const columns = createColumns({
    viewItem(row) {
      showModal.value = true;
      method.value = 'view';
      rowdata.value = row;
    },
    editItem(row) {
      showModal.value = true;
      method.value = 'edit';
      rowdata.value = row;
    },
    deleteItem(row, index) {
      data.value.splice(index, 1);
    }
  })

  return {
    columns,
  }
}


//  用法/写法 在vue里如何引用
//  需要 import { useTableDate } from '../common/actionButton.js'
// const columsName = [ //data-table 的列名
//   {
//     type: 'selection',//多选框
//   },
//   {
//     title: '名称',
//     key: 'name'
//   },
//   {
//     title: '分类',
//     key: 'type'
//   }
// ]
//公共 table 引入
// const { columns } = useTableDate({ showModal, method, rowdata, data, columsName })
//最后在 setup中 return里 columns返回即可



// export {
// "btnView": {
//   type: NButton, prop: {type: "primary", "design-type": "control"}, children: "aaaa"
// },
// "btnEdit": {
//   type: NButton, prop: {type: "primary", "design-type": "control"}, children: "bbbb"
// }
// }

// import buttons from ....


// render:
//    render([buttons.btnView, buttons.btnEdit, buttons.btnDelete])

//    render(controls) {

// 	  function make(ary) {
//         let list = [];
//         if(typeof(ary) === 'string') {
//           return ary;
//         }
//         if(ary?.length > 0) {
//           for(let i=0; i < ary.length; ++ i) {
//             list.push(h(ary[i].type, ary[i].prop, make(ary[i].children)));
//           }
//         }
//         return list;
//       }
//       return h("div", {"class": "draggable"}, make(controls));
//     }
//    }
