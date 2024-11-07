import { requestClient } from '#/api/request';

// 查询SysApi列表
export function listSysApi(query: any) {
  return requestClient.get(`/sys-api/get`, { params: query });
}

// 查询SysApi详细
export function getSysApi(id: number | string) {
  return requestClient.post(`/sys-api/get/${id}`);
}

// 新增SysApi
export function addSysApi(data: any) {
  return requestClient.post('/sys-api/addd', data);
}

// 修改SysApi
export function updateSysApi(data: any) {
  return requestClient.post(`/sys-api/edit/${data.id}`, data);
}

// 删除SysApi
export function delSysApi(data: any) {
  return requestClient.post('/sys-api/del', data);
}
