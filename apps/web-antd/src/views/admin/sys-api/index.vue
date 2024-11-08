<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { createVNode, h } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { MajesticonsEditOpen4, WeuiDeleteOutlined } from '@vben/icons';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal as antdModal, Button, message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delSysApi, listSysApi } from '#/api/core/sys-interface';

import EditDrawer from './drawer.vue';

defineOptions({
  name: 'SysApiManage',
});

interface RowType {
  title: string;
  path: string;
  id: string;
  action: string;
  type: string;
}

const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: EditDrawer,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
    },
    {
      component: 'Input',
      fieldName: 'path',
      label: '地址',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: 'POST',
          },
          {
            label: 'PUT',
            value: 'PUT',
          },
          {
            label: 'DELETE',
            value: 'DELETE',
          },
        ],
        placeholder: '请选择Method',
      },
      fieldName: 'action',
      label: 'Method',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'SYS',
            value: 'SYS',
          },
          {
            label: 'BUS',
            value: 'BUS',
          },
        ],
        placeholder: '请选择类型',
      },
      fieldName: 'type',
      label: '类型',
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
    { field: 'title', title: '标题', slots: { default: 'title' } },
    { field: 'path', title: 'Request Info', slots: { default: 'path' } },
    { field: 'handle', title: 'Handle' },
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
        const data = await listSysApi({
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

const onEdit = (row: any) => {
  drawerApi.setData({
    type: 'edit',
    id: row.apiId,
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

const onDelete = async (row: any) => {
  antdModal.confirm({
    title: '是否确认删除吗',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      const req: any = {
        apiIds: [row.apiId],
      };
      await delSysApi(req);
      message.success('删除成功');
      gridApi.reload();
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #title="{ row }">
        <Tag color="processing">[{{ row.type }}] {{ row.title }}</Tag>
      </template>
      <template #path="{ row }">
        <Tag v-if="row.action === 'GET'" color="processing">
          {{ row.action }}
        </Tag>
        <Tag v-if="row.action === 'POST'" color="success">
          {{ row.action }}
        </Tag>
        <Tag v-if="row.action === 'PUT'" color="warning">
          {{ row.action }}
        </Tag>
        <Tag v-if="row.action === 'DELETE'" color="error">
          {{ row.action }}
        </Tag>
        {{ row.path }}
      </template>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="onAdd">新增</Button>
      </template>
      <template #action="{ row }">
        <Button
          v-if="row.modifiable"
          :icon="h(MajesticonsEditOpen4)"
          type="link"
          @click="onEdit(row)"
        >
          <span class="ml-2">编辑</span>
        </Button>
        <Button
          v-if="row.modifiable"
          :icon="h(WeuiDeleteOutlined)"
          type="link"
          @click="onDelete(row)"
        >
          <span class="ml-2">删除</span>
        </Button>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
