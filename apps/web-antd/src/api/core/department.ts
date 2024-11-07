import { requestClient } from '#/api/request';

export function getDeptList(query: any) {
  return requestClient.get('/dept', { params: query });
}

// 查询部门详细
export function getDept(deptId: any) {
  return requestClient.get(`/dept/${deptId}`);
}

// 查询部门下拉树结构
export function treeselect() {
  return requestClient.get(`/deptTree`);
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId: any) {
  return requestClient.get(`/roleDeptTreeselect/${roleId}`);
}

// 新增部门
export function addDept(data: any) {
  return requestClient.post(`/dept`, data);
}

// 修改部门
export function updateDept(data: any, id: any) {
  return requestClient.put(`/dept/${id}`, data);
}

// 删除部门
export function delDept(data: any) {
  return requestClient.delete(`/dept`, data);
}
