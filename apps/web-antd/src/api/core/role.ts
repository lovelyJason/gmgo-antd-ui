import { requestClient } from '#/api/request';

// 查询角色列表
export function listRole(query: any) {
  return requestClient.get(`/role/get`, { params: query });
}

// 查询角色详细
export function getRole(roleId: any) {
  return requestClient.get(`/role/get/${roleId}`);
}

// 新增角色
export function addRole(data: any) {
  return requestClient.post('/role/add', data);
}

// 修改角色
export function updateRole(data: any, roleId: number) {
  return requestClient.post(`/role/edit/${roleId}`, data);
}

// 角色数据权限
export function dataScope(data: any) {
  return requestClient.put('/roledatascope', data);
}

// 角色状态修改
export function changeRoleStatus(roleId: any, status: string) {
  const data = {
    roleId,
    status,
  };
  return requestClient.post('/role-status', data);
}

// 删除角色
export function delRole(roleId: any) {
  return requestClient.delete('/role/del', { data: roleId });
}

export function getListrole(id: any) {
  return requestClient.get(`/menu/role/${id}`);
}

// export function getMenuNames() {
//   return requestClient({
//     url: '/menuids',
//     method: 'get'
//   })
// }
