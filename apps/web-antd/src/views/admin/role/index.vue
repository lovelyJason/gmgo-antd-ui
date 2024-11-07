<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { MajesticonsEditOpen4, WeuiDeleteOutlined } from '@vben/icons';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { changeRoleStatus, listRole } from '#/api/core/role';

import EditDrawer from './drawer.vue';
// import { changeUserStatus } from '#/api';

defineOptions({
  name: 'SysRoleManage',
});

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      defaultValue: '1',
      fieldName: 'category',
      label: '名称',
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: '权限字符',
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
        placeholder: '请选择',
      },
      fieldName: 'color',
      label: '状态',
    },
    // {
    //   component: 'DatePicker',
    //   fieldName: 'datePicker',
    //   label: 'Date',
    // },
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
    { field: 'roleId', title: '角色ID', width: 100 },
    { field: 'roleName', title: '名称' },
    { field: 'roleKey', title: '权限字符' },
    { field: 'roleSort', title: '排序' },
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
        const data = await listRole({
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
    id: row.roleId,
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

const onUserStatusChange = async (checked: string, record: any) => {
  try {
    const { roleId } = record;
    await changeRoleStatus(roleId, checked);
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
        <!-- <Button :icon="h(GgData)" type="link">
          <span class="ml-2">数据权限</span>
        </Button> -->
        <Button
          v-if="row.roleKey !== 'admin'"
          :icon="h(WeuiDeleteOutlined)"
          type="link"
        >
          <span class="ml-2">删除</span>
        </Button>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
