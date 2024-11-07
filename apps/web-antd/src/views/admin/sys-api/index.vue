<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { MajesticonsEditOpen4 } from '@vben/icons';

import { Button, message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listSysApi } from '#/api/core/sys-interface';

import EditDrawer from './drawer.vue';

defineOptions({
  name: 'SysApiManage',
});

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
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
      fieldName: 'productName',
      label: '地址',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'GET',
            value: '1',
          },
          {
            label: 'POST',
            value: '2',
          },
          {
            label: 'PUT',
            value: '3',
          },
          {
            label: 'DELETE',
            value: '4',
          },
        ],
        placeholder: '请选择Method',
      },
      fieldName: 'color',
      label: 'Method',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'SYS',
            value: '1',
          },
          {
            label: 'BUS',
            value: '2',
          },
        ],
        placeholder: '请选择类型',
      },
      fieldName: 'color',
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

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });

const openDrawer = (row) => {
  drawerApi.setData({
    id: row.id,
  });
  drawerApi.open();
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
        <Button class="mr-2" type="primary">新增</Button>
      </template>
      <template #action="{ row }">
        <Button :icon="h(MajesticonsEditOpen4)" type="link">
          <span class="ml-2" @click="openDrawer(row)">编辑</span>
        </Button>
        <!-- <Button
          v-if="row.roleKey !== 'admin'"
          :icon="h(WeuiDeleteOutlined)"
          type="link"
        >
          <span class="ml-2">删除</span>
        </Button> -->
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
