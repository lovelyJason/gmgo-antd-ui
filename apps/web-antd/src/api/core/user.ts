import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/getinfo');
}

// 查询用户列表
export function listUser(query: any) {
  return requestClient.get('/sys-user/get', { params: query });
}

// 查询用户详细
export function getUser(userId: any) {
  return requestClient.post(`/sys-user/get/${userId}`);
}

export function getUserInit() {
  return requestClient.get('/sys-user/');
}

// 新增用户
export function addUser(data: any) {
  return requestClient.post('/sys-user/add', data);
}

// 修改用户
export function updateUser(data: any) {
  return requestClient.post('/sys-user/edit', data);
}

// 删除用户
export function delUser(data: any) {
  return requestClient.post('/sys-user/del', data);
}

// 导出用户
export function exportUser(query: any) {
  return requestClient.get('/sys-user/export', { params: query });
}

// 用户密码重置
export function resetUserPwd(userId: any, password: any) {
  const data = {
    userId,
    password,
  };
  return requestClient.post('/user/pwd/reset', data);
}

// 用户状态修改
export function changeUserStatus(e: any) {
  const data = {
    userId: e.userId,
    status: e.status,
  };
  return requestClient.post('/user/status', data);
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return requestClient.put('/sys-user/profile', data);
}

// 下载用户导入模板
export function importTemplate() {
  return requestClient.get('/sys-user/importTemplate');
}

// 用户密码重置
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword,
  };
  return requestClient.put('/user/pwd/set', data);
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return requestClient.post('/user/avatar', data);
}

// 查询用户个人信息
export function getUserProfile() {
  return requestClient.get('/user/profile');
}
