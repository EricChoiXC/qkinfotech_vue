import {
  EmptyRouterView
} from '@/components/EmptyRouterView'
export function convertToRoutes(responseRoutes) {
  const convertChildren = (children) => {
    return children.map((child) => {
      const route = {
        ...child,
        key: child.key,
        path: child.key,
        label: child.label,
        icon: child.icon,

        // component: child.component ? () => import(child.component) : EmptyRouterView,
        component: child?.component,
        meta: {},
        children: child.children ? convertChildren(child.children) : undefined,
        display: child?.display,
        url: child?.url,
      };
      // Check if there are menu items
      if (child.menu && child.menu.length > 0) {
        route.menu = convertChildren(child.menu);
      }

      return route;
    });
  };
  return responseRoutes.map((route) => {
    const convertedRoute = {
      key: route.key,
      path: route.key,
      label: route.label,

      // component: route.component ? () => import(route.component) : EmptyRouterView,
      component: route?.component,
      meta: {},
      children: route.children ? convertChildren(route.children) : undefined,
    };
    // Check if there are menu items
    if (route.menu && route.menu.length > 0) {
      // convertedRoute.children = convertedRoute.children.concat(convertChildren(route.menu));
      convertedRoute.menu = convertChildren(route.menu);
    }
    return convertedRoute;
  });
}
