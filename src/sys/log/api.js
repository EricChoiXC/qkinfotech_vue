import request from "@/utils/request2";
import context from '@/context.js';

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/', {

    readDocumentLog : "readLog/readDocument",
    readLogAttachment : "readLog/readAttachment"

  })

  return api
}
export default createApi
