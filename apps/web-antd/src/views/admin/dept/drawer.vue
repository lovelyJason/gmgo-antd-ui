<script lang="tsx" setup>
import type { Recordable } from '@vben/types';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useNamespace } from '@vben-core/composables';
import { VbenIcon } from '@vben-core/shadcn-ui';

import { Input, message, Transfer } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addMenu, getMenu, listMenu, updateMenu } from '#/api/core/menu';
import { listRole } from '#/api/core/role';

interface ChildProps {
  type: 'add' | 'edit';
  id: number;
  sysApiList: any[];
  menuList: any[];
  formData: any;
}

const nsMenu = useNamespace('menu');
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

const schema = ref<any>([]);
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
    const res = await FormApi.validate();
    if (!res.valid) return;
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

const filterOption = (inputValue: string, option: any) => {
  return option.title.includes(inputValue);
};

onMounted(() => {
  getRoleList();
});
</script>
<template>
  <Drawer :title="`${data.type === 'add' ? '新增' : '修改'}菜单`">
    <Form>
      <template #icon="slotProps">
        <Input placeholder="请输入" v-bind="slotProps" />
        <VbenIcon
          :class="nsMenu.e('icon')"
          :icon="slotProps.value"
          style="width: 28px; height: 28px; margin-left: 16px"
        />
      </template>
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
