<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Page } from '@vben/common-ui';
import { GgData, MajesticonsEditOpen4, WeuiDeleteOutlined } from '@vben/icons';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listRole } from '#/api/core/role';

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
            label: 'Color1',
            value: '1',
          },
          {
            label: 'Color2',
            value: '2',
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
    { title: '序号', type: 'seq', width: 50 },
    { field: 'roleId', title: '编码', width: 100 },
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
          page: page.currentPage,
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
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <Switch
          v-model:checked="row.status"
          checked-value="2"
          disabled
          un-checked-value="1"
        />
      </template>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary">新增</Button>
        <Button class="mr-2" type="dashed">修改</Button>
        <Button class="mr-2" danger>删除</Button>
        <Button class="mr-2" type="primary">导出</Button>
      </template>
      <template #action="{ row }">
        <Button :icon="h(MajesticonsEditOpen4)" type="link">
          <span class="ml-2">编辑</span>
        </Button>
        <Button :icon="h(GgData)" type="link">
          <span class="ml-2">数据权限</span>
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
  </Page>
</template>
