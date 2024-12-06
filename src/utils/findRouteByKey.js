export function findRouteByKey(routes, key) {

  for (const route of routes) {
    if (route.key === key) {
      return route;
    }

    // 如果有子菜单，递归查找
    if (route.children) {
      const found = findRouteByKey(route.children, key);
      if (found) {
        return found;
      }
    }

    // 如果有菜单，递归查找
    if (route.menu) {
      const found = findRouteByKey(route.menu, key);
      if (found) {
        return found;
      }
    }
  }

  // 如果没有找到，返回null
  return null;
}
