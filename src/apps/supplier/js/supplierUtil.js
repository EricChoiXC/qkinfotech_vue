import {
  useDialog,
  useMessage,
} from "naive-ui";
import layout from "@/layout/layout";
import createApi from './api'

export default function setup() {
  const dialog = useDialog();
  const message = useMessage();
  const api = createApi(getCurrentInstance())

  //错误时限制弹窗
  function handleError(msg, tabKey) {
    dialog.error({
      title: "错误",
      content: msg,
      positiveText: "关闭",
      maskClosable: false,
      onEsc: () => {
        layout.close(tabKey);
      },
      onPositiveClick: () => {
        layout.close(tabKey);
      },
      onClose: () => {
        layout.close(tabKey);
      }
    });
  }

  //取公告超时时间
  async function getNoticeDateRange(fId, tabKey) {
    try {
      const result = await api.mainGetNoticeDateRange({
        fId: fId
      });
      const now = Date.now();
      if (!result.data.flag && result.data.deadline < now) {
        await handleError("超出申请文件提交日期！", tabKey);
      } else {
        // 如果没有超出期限，返回请求结果
        return result;
      }
    } catch (error) {
      console.error('请求失败:', error);
    }
  }

  //撤回提示
  function WithdrawalTip(msg, fId, fCurrentStatus) {
    dialog.warning({
      title: '提示',
      content: msg,
      positiveText: '是',
      negativeText: '否',
      maskClosable: false,
      onPositiveClick: () => {
        api.supplierMainSave({
          fId: fId,
          fCurrentStatus: fCurrentStatus
        }).then(result => {
          message.info('撤回成功！')
          layout.close("supplier-edit");
          window.close()
        });
      },
    })
  }


  return {
    handleError,
    getNoticeDateRange,
    WithdrawalTip
  };
}
