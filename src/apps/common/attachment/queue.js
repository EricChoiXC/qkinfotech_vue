const isPromise = (obj) => {
  return !!obj //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
    &&
    (typeof obj === 'object' || typeof obj === 'function') // 初始promise 或 promise.then返回的
    &&
    typeof obj.then === 'function';
}

class ProcessQueue {
  constructor(max) {
    let queue = [];
    let count = 0;

    if(max == undefined) {
      max = 5;
    }
    if (max < 1) {
      max = 1;
    }

    let scheduled = false;
    let schedule = () => {
      if (!scheduled) {
        scheduled = true;
        setTimeout(run, 0);
      }
    }

    let run = () => {
      scheduled = false;
      do {
        let item = queue.pop();
        if (item == undefined) {
          break;
        }
        let r = item.consumer(item.data);
        if (isPromise(r)) {
          ++count;
          r.finally(() => {
            --count;
            schedule();
          })
        }
      } while (count < max)

    }

    this.add = (consumer, data) => {
      queue.unshift({
        consumer: consumer,
        data: data
      })
      schedule();
    }
  }
}

export default ProcessQueue
