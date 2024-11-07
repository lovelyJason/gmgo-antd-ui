<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { MenuType, SysApiType } from './index.vue';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message, Transfer } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addMenu, getMenu, listMenu, updateMenu } from '#/api/core/menu';
import { listRole } from '#/api/core/role';

interface ChildProps {
  type: 'add' | 'edit';
  id: number;
  sysApiList: SysApiType[];
  menuList: MenuType[];
  formData: MenuType;
}

const data = ref<Partial<ChildProps>>({
  type: 'add',
  sysApiList: [],
  menuList: [],
  formData: {},
  reload: () => {},
});
const selectedRoleKeys = ref<string[]>([]);
const targetRoleKeys = ref<string[]>([]);
const menuList = ref<MenuType[]>([]);
// const menuList = computed(() => {
//   const menu: any = { menuId: 0, title: '主类目', children: [] };
//   menu.children = data.value.menuList;
//   return [menu];
// });
const menuInfo = ref<MenuType>({});
const roleList = ref<Recordable<any>[]>([]);

// const disabled = computed(() => data.value.type === 'edit');
const roleTransferData = computed(() => {
  return (
    data.value?.sysApiList?.map((item) => {
      return {
        key: item.id,
        title: item.title,
      };
    }) ?? []
  );
});

const schema = ref<any>([
  {
    component: 'TreeSelect',
    componentProps: {
      placeholder: '请选择',
      fieldNames: {
        label: 'title',
        value: 'menuId',
        key: 'menuId',
      },
      treeData: menuList,
      disabled: data.value.type === 'add',
    },
    fieldName: 'parentId',
    label: '上级菜单',
    rules: 'required',
    help: '指当前菜单停靠的菜单归属',
    formItemClass: 'col-span-2',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'title',
    label: '菜单标题',
    rules: 'required',
    help: '菜单位置显示的说明信息',
    formItemClass: 'mr-4',
  },
  {
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'sort',
    label: '显示排序',
    rules: 'required',
    help: '根据序号升序排列',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      placeholder: '请输入',
      options: [
        {
          label: '目录',
          value: 'M',
        },
        {
          label: '菜单',
          value: 'C',
        },
        {
          label: '按钮',
          value: 'F',
        },
      ],
    },
    fieldName: 'menuType',
    label: '菜单类型',
    rules: 'required',
    help: '包含目录：以及菜单或者菜单组，菜单：具体对应某一个页面，按钮：功能才做按钮；',
    formItemClass: 'col-span-2',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'icon',
    label: '菜单图标',
    rules: 'required',
    formItemClass: 'col-span-2',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'menuName',
    label: '路由名称',
    rules: 'required',
    help: '需要和页面name保持一致，对应页面即可选择缓存',
    formItemClass: 'mr-4',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return values.menuType !== 'F';
      },
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'component',
    label: '组件路径',
    rules: 'required',
    help: '菜单对应的具体vue页面文件路径views的下级路径/admin/sys-api/index；目录类型：填写Layout，如何有二级目录请参照日志目录填写；',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return values.menuType !== 'F';
      },
    },
  },
  {
    component: 'RadioGroup',
    componentProps: {
      placeholder: '请输入',
      options: [
        {
          label: '是',
          value: '0',
        },
        {
          label: '否',
          value: '1',
        },
      ],
    },
    fieldName: 'isFrame',
    label: '是否外链',
    rules: 'required',
    help: '可以通过iframe打开指定地址',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return values.menuType !== 'F';
      },
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'path',
    label: '路由地址',
    rules: 'required',
    help: '访问此页面自定义的url地址，建议/开头书写，例如 /app-name/menu-name',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return values.menuType !== 'F';
      },
    },
  },
  // 注意，传递空数组不要设置菜单了，为全量
  {
    component: 'RadioGroup',
    componentProps: {
      placeholder: '请输入',
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
    },
    fieldName: 'visible',
    label: '菜单状态',
    rules: 'required',
    help: '需要显示在菜单列表的菜单设置为显示，否则设置为隐藏',
    // formItemClass: 'col-span-2',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return values.menuType !== 'F';
      },
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'permission',
    label: '权限标识',
    rules: 'required',
    help: '前端权限控制按钮是否显示',
    formItemClass: 'col-span-2',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return ['C', 'F'].includes(values.menuType);
      },
    },
  },
  {
    component: 'Divider',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'apiPermission',
    label: 'api权限',
    help: '配置在这个才做上需要使用到的接口，否则在设置用户角色时，接口将无权访问。',
    dependencies: {
      triggerFields: ['menuType'],
      show(values: any) {
        return ['C', 'F'].includes(values.menuType);
      },
    },
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
  layout: 'vertical',
  schema: schema.value,
  wrapperClass: 'grid-cols-2',
  showDefaultActions: false,
});

const getMenuInfo = async (menuId: number) => {
  menuInfo.value = await getMenu(menuId);
};

const getTreeSelect = async () => {
  const data = await listMenu({
    page: 1,
    pageSize: 1000,
  });
  const menu: any = { menuId: 0, title: '主类目', children: [] };
  menu.children = data;
  menuList.value = [menu];
};

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[830px]',
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const values = await FormApi.getValues();
    const body = { ...values };
    if (values.menuType !== 'M') {
      body.apis = targetRoleKeys.value;
    }
    await (data.value.type === 'add'
      ? addMenu(body)
      : updateMenu(body, data.value.id));
    message.success('操作成功');
    drawerApi.close();
    data.value.reload();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const ans = drawerApi.getData<Record<string, any>>();
      data.value = ans;
      getTreeSelect();
      if (ans.type === 'edit') {
        await getMenuInfo(ans.id);
        FormApi.setValues(menuInfo.value);
        targetRoleKeys.value = menuInfo.value.apis || [];
      } else {
        FormApi.setValues({
          parentId: ans.formData.menuId,
          menuType: 'M',
        });
      }
    }
  },
});

const getRoleList = async () => {
  const ans = await listRole({
    pageIndex: 1,
    pageSize: 1000,
  });
  roleList.value = ans.list.map((item: any) => {
    return {
      label: item.roleName,
      value: item.roleId,
    };
  });
};

const filterOption = (inputValue: string, option: SysApiType) => {
  return option.title.includes(inputValue);
};

onMounted(() => {
  getRoleList();
});
</script>
<template>
  <Drawer :title="`${data.type === 'add' ? '新增' : '修改'}菜单`">
    <Form>
      <template #apiPermission>
        <Transfer
          v-model:selected-keys="selectedRoleKeys"
          v-model:target-keys="targetRoleKeys"
          :data-source="roleTransferData"
          :filter-option="filterOption"
          :list-style="{
            width: '300px',
            height: '350px',
          }"
          :render="(item) => item.title"
          :titles="['未授权', '已授权']"
          show-search
        />
      </template>
    </Form>
  </Drawer>
</template>
