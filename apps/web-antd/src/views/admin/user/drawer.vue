<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { listRole } from '#/api/core/role';
import { addUser, getUser, updateUser } from '#/api/core/user';

const data = ref({
  type: 'add',
});
const userInfo = ref({});
const roleList = ref<Recordable[]>([]);

const disabled = computed(() => data.value.type === 'edit');

const schema = ref<any>([
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'nickName',
    label: '用户昵称',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'phone',
    label: '手机号码',
    rules: z
      .string()
      .refine(
        (value) =>
          /^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[1589])\d{8}$/.test(
            value,
          ),
        {
          message: '必须为11位正确号码',
        },
      ),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'email',
    label: '邮箱',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled,
    },
    fieldName: 'username',
    label: '用户名称',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      placeholder: '请输入',
      options: [
        {
          label: '男',
          value: '1',
        },
        {
          label: '女',
          value: '2',
        },
      ],
    },
    fieldName: 'sex',
    label: '用户性别',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
    defaultValue: '2',
    componentProps: {
      placeholder: '请输入',
      options: [
        {
          label: '正常',
          value: '2',
        },
        {
          label: '停用',
          value: '1',
        },
      ],
    },
    fieldName: 'status',
    label: '状态',
    rules: 'required',
  },
  // 注意，传递空数组不要设置菜单了，为全量
  {
    component: 'Select',
    fieldName: 'roleId',
    label: '角色',
    rules: 'required',
    componentProps: {
      options: roleList,
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'remark',
    label: '备注',
  },
]);
const [Form, FormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: schema.value,
  wrapperClass: 'grid-cols-1',
  showDefaultActions: false,
});

const getUserInfo = async (userId: numer) => {
  const ans = await getUser(userId);
  userInfo.value = ans;
};

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[830px]',
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const res = await FormApi.validate();
    if (!res.valid) return;
    const values = await FormApi.getValues();
    await (data.value.type === 'add'
      ? addUser(values)
      : updateUser({ ...values, userId: data.value.id }));
    message.success('操作成功');
    drawerApi.close();
    data.value.reload();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const ans = drawerApi.getData<Record<string, any>>();
      data.value = ans;
      if (ans.type === 'edit') {
        await getUserInfo(ans.id);
        FormApi.setValues(userInfo.value);
      }
    }
  },
});

const getRoleList = async () => {
  const ans = await listRole({
    pageIndex: 1,
    pageSize: 1000,
  });
  roleList.value = ans.list.map((item) => {
    return {
      label: item.roleName,
      value: item.roleId,
    };
  });
};

onMounted(() => {
  getRoleList();
});
</script>
<template>
  <Drawer :title="`${data.type === 'add' ? '新增' : '修改'}用户`">
    <Form />
  </Drawer>
</template>
, addUser
