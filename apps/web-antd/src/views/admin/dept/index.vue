<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import {
  MajesticonsEditOpen4,
  WeuiAddFilled,
  WeuiDeleteOutlined,
} from '@vben/icons';

import { Button, message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeptList } from '#/api/core/department';

import EditDrawer from './drawer.vue';

defineOptions({
  name: 'SysDeptManage',
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
      fieldName: 'deptName',
      label: '部门名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '正常',
            value: '1',
          },
          {
            label: '停用',
            value: '2',
          },
        ],
        placeholder: '请选择',
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
    { title: '序号', type: 'seq', width: 50 },
    { field: 'deptName', title: '部门名称', width: 500, treeNode: true },
    { field: 'sort', title: '排序' },
    { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'createdAt', formatter: 'formatDateTime', title: '创建时间' },
    { align: 'left', slots: { default: 'action' }, title: '操作' },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  treeConfig: {
    rowField: 'deptId',
    childrenField: 'children',
    expandAll: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        message.success(`Query params: ${JSON.stringify(formValues)}`);
        const data = await getDeptList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return {
          items: data,
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
    id: row.deptId,
    reload: gridApi.reload,
  });
  drawerApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <Tag v-if="row.status === 2" color="green">正常</Tag>
        <Tag v-if="row.status === 1" color="red">停用</Tag>
      </template>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary">新增</Button>
      </template>
      <template #action="{ row }">
        <Button
          :icon="h(MajesticonsEditOpen4)"
          type="link"
          @click="onEdit(row)"
        >
          <span class="ml-2">修改</span>
        </Button>
        <Button :icon="h(WeuiAddFilled)" type="link">
          <span class="ml-2">新增</span>
        </Button>
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
