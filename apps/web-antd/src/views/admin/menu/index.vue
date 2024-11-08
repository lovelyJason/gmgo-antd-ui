<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { createVNode, h, onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import {
  MajesticonsEditOpen4,
  WeuiAddFilled,
  WeuiDeleteOutlined,
} from '@vben/icons';
import { useNamespace } from '@vben-core/composables';
import { VbenIcon } from '@vben-core/shadcn-ui';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal as antdModal, Button, message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delMenu, listMenu } from '#/api/core/menu';
import { listSysApi } from '#/api/core/sys-interface';

import EditDrawer from './drawer.vue';

defineOptions({
  name: 'SysMenuManage',
});

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

export interface SysApiType {
  [key: string]: any;
}

export interface MenuType {
  [key: string]: any;
  menuId: number;
  menuName: string;
  menuType: 'C' | 'F' | 'M';
  path: string;
  paths: string;
  title: string;
  component: string;
  children: MenuType[];
}

const nsMenu = useNamespace('menu');

const menuList = ref<MenuType[]>([]);
const sysApiList = ref<any[]>([]);

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Select',
      fieldName: 'title',
      label: '菜单名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '显示',
            value: '0',
          },
          {
            label: '隐藏',
            value: '1',
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'visible',
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
    { field: 'title', title: '菜单名称', width: 500, treeNode: true },
    {
      field: 'icon',
      title: '图标',
      width: '120px',
      slots: { default: 'icon' },
    },
    { field: 'sort', title: '排序', width: '60px' },
    { field: 'permission', title: '权限标识' },
    { field: 'path', title: '组件路径', slots: { default: 'path' } },
    {
      field: 'visible',
      title: '可见',
      width: '80px',
      slots: { default: 'visible' },
    },
    { field: 'createdAt', formatter: 'formatDateTime', title: '创建时间' },
    { align: 'left', slots: { default: 'action' }, title: '操作' },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  treeConfig: {
    rowField: 'deptId',
    childrenField: 'children',
    expandAll: false,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        message.success(`Query params: ${JSON.stringify(formValues)}`);
        const data = await listMenu({
          page: page.currentPage,
          pageSize: 1000,
          ...formValues,
        });
        menuList.value = data;
        return {
          items: data,
        };
      },
    },
  },
};

const getSysApiList = async () => {
  const data = await listSysApi({
    pageIndex: 1,
    pageSize: 1000,
    type: 'BUS',
  });
  sysApiList.value = data.list;
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: EditDrawer,
});

const onEdit = (row: any) => {
  drawerApi.setData({
    type: 'edit',
    id: row.menuId,
    sysApiList: sysApiList.value,
    menuList: menuList.value,
    reload: gridApi.reload,
  });
  drawerApi.open();
};

const onAdd = (row: MenuType | number) => {
  // console.log('row', row);
  if (row === 0) {
    drawerApi.setData({
      type: 'add',
      sysApiList: sysApiList.value,
      menuList: menuList.value,
      formData: {
        menuId: 0,
      },
      reload: gridApi.reload,
    });
  } else {
    drawerApi.setData({
      type: 'add',
      sysApiList: sysApiList.value,
      menuList: menuList.value,
      formData: row,
      reload: gridApi.reload,
    });
  }

  drawerApi.open();
};

const onDelete = (row: any) => {
  antdModal.confirm({
    title: '是否确认删除？',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      const req: any = {
        menuIds: [row.menuId],
      };
      await delMenu(req);
      message.success('操作成功');
      gridApi.reload();
    },
  });
};

onMounted(() => {
  getSysApiList();
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #icon="{ row }">
        <VbenIcon
          :class="nsMenu.e('icon')"
          :icon="row.icon"
          style="width: 26px; height: 26px"
        />
      </template>
      <template #path="{ row }">
        <span v-if="row.menuType === 'A'">{{ row.path }}</span>
        <span v-else>{{ row.component }}</span>
      </template>
      <template #visible="{ row }">
        <Tag v-if="row.visible === '0'" color="green">显示</Tag>
        <Tag v-if="row.visible === '1'" color="red">隐藏</Tag>
      </template>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="onAdd(0)">新增</Button>
      </template>
      <template #action="{ row }">
        <Button
          :icon="h(MajesticonsEditOpen4)"
          type="link"
          @click="onEdit(row)"
        >
          <span class="ml-2">修改</span>
        </Button>
        <Button :icon="h(WeuiAddFilled)" type="link" @click="onAdd(row)">
          <span class="ml-2">新增</span>
        </Button>
        <Button
          v-if="row.roleKey !== 'admin'"
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
