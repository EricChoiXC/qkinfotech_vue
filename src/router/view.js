import pages from './pages.js'

async function load(router) {

  // 加载布局
  router.addRoute({
    path: '/view',
    name: 'view',
    component: () => import('@/layout/view/index.vue'),
  });

  let views = ["filesSerch","supplier-union-view"]
  views.map(v => {
    let page = pages[v];
    router.addRoute('view', {
      path: page.path.substring(1),
      name: v,
      component: page.component,
    })
  })

  router.addRoute('view', {
    path: '/',
    redirect: '/view/home/workbench',
  });

  router.addRoute('view', {
    path: '/view/ppt-view',
    name: 'ppt-view',
    component: () => import('@/apps/supplier/preview/preview_pdf_view.vue'),
  });

  router.addRoute('view', {
    path: '/view/attachment-view',
    name: 'attachment-view',
    component: () => import('@/apps/common/attachment/attachmentViewer_viewRoute.vue'),
  })

  router.addRoute('view', {
    path: '/view/package-view',
    name: 'package-view',
    component: () => import('@/apps/supplier/packageView.vue'),
  });

  router.addRoute('view', {
    path: '/view/package-new-view',
    name: 'package-new-view',
    component: () => import('@/apps/supplier/packageNewView.vue'),
  });

  router.addRoute('view', {
    path: '/view/package-new-info',
    name: 'package-new-info',
    component: () => import('@/apps/supplier/packageNewInfo.vue'),
  });

  router.addRoute('view', {
    path: '/view/supplier-view',
    name: 'supplier-view',
    component: () => import('@/apps/supplier/supplier_view.vue'),
  });

  router.addRoute('view', {
    path: '/view/supplier-edit',
    name: 'supplier-edit',
    component: () => import('@/apps/supplier/supplier_edit.vue'),
  });
  router.addRoute('view', {
    path: '/view/supplier-add',
    name: 'supplier-add',
    component: () => import('@/apps/supplier/supplier_add.vue'),
  });

  router.addRoute('view', {
    path: '/view/filesSerch',
    name: 'filesSerch',
    component: () => import('@/apps/credentials/pre-audit/filesSerch.vue'),
  });

  router.addRoute('view', {
    path: '/view/actionSuccess',
    name: 'actionSuccess',
    component: () => import('@/apps/common/windowSuccess.vue'),
  });

  router.addRoute('view', {
    path: '/view/companyView',
    name: 'companyView',
    component: () => import('@/apps/credentials/pre-audit/notice/notice_company_view.vue'),
  });

  //iso审批单 edit
  router.addRoute('view', {
    path: '/view/projectManagement/implementation/project-iso-edit',
    name: 'projectManagement/implementation/project-iso-edit',
    component: () => import('@/apps/iso/isoApproval_edit.vue'),
  });

  //iso审批单 view
  router.addRoute('view', {
    path: '/view/projectManagement/implementation/project-iso-view',
    name: 'projectManagement/implementation/project-iso-view',
    component: () => import('@/apps/iso/isoApproval_view.vue'),
  });

  router.addRoute('view', {
    path: '/view/approval',
    name: 'approval',
    component: () => import('@/apps/project/approval/approval_view.vue'),
  });
  //权限菜单配置页面
  router.addRoute('view', {
    path: '/view/sys/menu/edit',
    name: 'sys/menu/edit',
    component: () => import('@/sys/menu/edit.vue'),
  });


  //404无权限页面
  router.addRoute('view', {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/404.vue')
  });
  //403无权限页面
  router.addRoute('view', {
    path: '/view/no-permission',
    name: 'NoPermission',
    component: () => import('@/views/common/403.vue')
  });

}

export default load
