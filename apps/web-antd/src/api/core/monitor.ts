import { requestClient } from '#/api/request';

// 查询角色列表
export function getServerMonitor() {
  return requestClient.get(`/server-monitor`);
}
