import context from '@/context.js'
import opdesk from './opdesk.js'
import view from './view.js'

let layout = 'opdesk';
const pathname = window.location.pathname
if (pathname == context.path || pathname == context.path + '/') {
  // 默认 opdesk
} else {
  layout = pathname.split("/")[context.path == '' ? 1 : 2]
}

let load;
switch(layout){
  case 'opdesk':
    load = opdesk
    break;
  case 'view':
    load = view
    break;
  default:
    load = opdesk
    break;
}

export default load

// import context from '@/context.js'
// import opdesk from './opdesk.js'


// let layout = 'opdesk';
// const pathname = window.location.pathname
// if (pathname == context.path || pathname == context.path + '/') {
//   // 默认 opdesk
// } else {
//   layout = pathname.split("/")[context.path == '' ? 1 : 2]
// }

// switch(layout){
//   case 'opdesk':
//     layout = await import('./opdesk.js')
//     break;
//   default:
//     layout = await import('./opdesk.js')
//     break;
// }

// const load = layout.default;

// export default await load
