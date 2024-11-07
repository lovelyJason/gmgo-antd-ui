<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message, Tree } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { roleMenuTreeselect } from '#/api/core/menu';
import { addRole, getRole, updateRole } from '#/api/core/role';

const data = ref({
  type: 'add',
  reload: () => {},
});
const roleInfo = ref({ menus: [] });
const treeData = ref([]);
const selectedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);

const disabled = computed(() => data.value.type === 'edit');

const schema = ref<any>([
  {
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入',
      disabled,
      min: 2,
    },
    fieldName: 'roleId',
    // 界面显示的label
    label: '角色ID',
    rules: 'required',
    dependencies: {
      triggerFields: ['menuType'],
      show(_values: any) {
        return data.value.type === 'edit';
      },
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled,
    },
    fieldName: 'roleName',
    // 界面显示的label
    label: '角色名称',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled,
    },
    fieldName: 'roleKey',
    label: '权限字符',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'roleSort',
    label: '角色顺序',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
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
    component: 'Divider',
    fieldName: 'menus',
    label: '菜单权限',
    rules: 'required',
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

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[830px]',
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const values = await FormApi.getValues();
    const body = {
      ...values,
      menus: checkedKeys.value,
    };
    // console.log(body, selectedKeys.value, checkedKeys.value);
    await (data.value.type === 'add'
      ? addRole(body)
      : updateRole(body, data.value.id));
    message.success('操作成功');
    drawerApi.close();
    data.value.reload();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const ans = drawerApi.getData<Record<string, any>>();
      data.value = ans;
      if (ans.type === 'edit') {
        const detail = await getRole(ans.id);
        roleInfo.value = detail;
        FormApi.setValues({
          ...detail,
        });
        checkedKeys.value = detail.menus;
      }
    }
  },
});

const getMenuTree = async () => {
  const ans = await roleMenuTreeselect(0);
  treeData.value = ans.menus;
};

onMounted(() => {
  getMenuTree();
});
</script>
<template>
  <Drawer title="修改接口">
    <Form>
      <template #menus>
        <div
          v-if="data.type === 'edit' && roleInfo.admin"
          class="flex h-[170px] w-[380px] items-center pl-6 text-[#909399]"
        >
          系统超级管理员无需此操作
        </div>
        <Tree
          v-if="!roleInfo.admin"
          v-model:checked-keys="checkedKeys"
          v-model:selected-keys="selectedKeys"
          :field-names="{ title: 'label', key: 'id' }"
          :tree-data="treeData"
          checkable
        />
      </template>
    </Form>
  </Drawer>
</template>
