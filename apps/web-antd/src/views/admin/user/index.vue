<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { createVNode, h, ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  FluentKeyReset20Regular,
  MajesticonsEditOpen4,
  WeuiDeleteOutlined,
} from '@vben/icons';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Modal as antdModal,
  Button,
  Input,
  message,
  Switch,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeUserStatus,
  delUser,
  listUser,
  resetUserPwd,
} from '#/api/core/user';

import EditDrawer from './drawer.vue';

defineOptions({
  name: 'SysUserManage',
});

const curUser = ref<Recordable<any>>({});

const newPassword = ref('');

interface RowType {
  [key: string]: any;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名称',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号码',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
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
        placeholder: '用户状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field: 'userId', title: '用户ID' },
    { field: 'username', title: '登录名' },
    { field: 'nickName', title: '昵称' },
    { field: 'phone', title: '手机号' },
    { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'createdAt', formatter: 'formatDateTime', title: '创建时间' },
    { align: 'left', slots: { default: 'action' }, title: '操作' },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        message.success(`Query params: ${JSON.stringify(formValues)}`);
        const data = await listUser({
          pageIndex: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        // TODO:先为了兼容go admin数据结构
        return {
          ...data,
          total: data.count,
          items: data.list,
        };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: EditDrawer,
});

const onEdit = (row: any) => {
  drawerApi.setData({
    type: 'edit',
    id: row.userId,
    reload: gridApi.reload,
  });
  drawerApi.open();
};

const onAdd = () => {
  drawerApi.setData({
    type: 'add',
    reload: gridApi.reload,
  });
  drawerApi.open();
};

const [Modal, modalApi] = useVbenModal({
  closeOnClickModal: false,
  async onConfirm() {
    await resetUserPwd(curUser.value.userId, newPassword.value);
    message.success('操作成功');
    modalApi.close();
  },
});

const onPasswordReset = (row: any) => {
  modalApi.open();
  curUser.value = row;
};

const onDelete = (row: any) => {
  antdModal.confirm({
    title: '是否确认删除吗',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      const req: any = {
        userIds: [row.userId],
      };
      await delUser(req);
      message.success('操作成功');
      gridApi.reload();
    },
  });
};

const onUserStatusChange = async (checked: string, record: any) => {
  try {
    const { userId } = record;
    await changeUserStatus({
      userId,
      status: checked,
    });
    // gridApi.reload();
  } catch {
    // console.log('error', error);
    record.status = 3 - Number.parseInt(checked);
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <Switch
          v-model:checked="row.status"
          checked-value="2"
          un-checked-value="1"
          @change="onUserStatusChange($event, row)"
        />
      </template>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="onAdd">新增</Button>
      </template>
      <template #action="{ row }">
        <Button
          :icon="h(MajesticonsEditOpen4)"
          type="link"
          @click="onEdit(row)"
        >
          <span class="ml-2">编辑</span>
        </Button>
        <Button
          v-if="row.userId !== 1"
          :icon="h(WeuiDeleteOutlined)"
          type="link"
          @click="onDelete(row)"
        >
          <span class="ml-2">删除</span>
        </Button>
        <Button :icon="h(FluentKeyReset20Regular)" type="link">
          <span class="ml-2" @click="onPasswordReset(row)">重置</span>
        </Button>
      </template>
    </Grid>
    <Drawer />
    <Modal title="重置密码">
      <p class="mb-8">请输入新密码</p>
      <Input v-model:value="newPassword" />
    </Modal>
  </Page>
</template>
