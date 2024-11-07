import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menurole');
}

// 查询菜单列表
export function listMenu(query: any) {
  return requestClient.get('/menu/get', { params: query });
}

// 查询菜单详细
export function getMenu(menuId: any) {
  return requestClient.get(`/menu/get/${menuId}`);
}

// 查询菜单下拉树结构
// export function treeselect() {
//   return request({
//     url: '/api/v1/menuTreeselect',
//     method: 'get'
//   })
// }

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: number) {
  return requestClient.get(`/roleMenuTreeselect/${roleId}`);
}

// 新增菜单
export function addMenu(data: any) {
  return requestClient.post('/menu/add', data);
}

// 修改菜单
export function updateMenu(data: any, id: any) {
  return requestClient.post(`/menu/edit/${id}`, data);
}

// 删除菜单
export function delMenu(data: any) {
  return requestClient.post(`/menu/del`, data);
}
