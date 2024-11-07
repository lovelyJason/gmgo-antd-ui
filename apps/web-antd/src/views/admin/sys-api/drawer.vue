<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { getSysApi } from '#/api/core/sys-interface';

const data = ref();

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
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入',
        disabled: true,
      },
      // 字段名
      fieldName: 'handle',
      // 界面显示的label
      label: 'Handle',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'title',
      label: '标题',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        disabled: true,
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: 'BUS',
            value: 'BUS',
          },
          {
            label: 'SYS',
            value: 'SYS',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      defaultValue: undefined,
      fieldName: 'type',
      label: '类型',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: '2',
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
        placeholder: '请选择',
        showSearch: true,
      },
      defaultValue: undefined,
      fieldName: 'action',
      label: 'Method',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'path',
      label: '地址',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1',
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const ans = drawerApi.getData<Record<string, any>>();
      data.value = ans;
      const detail = await getSysApi(ans.id);
      FormApi.setValues(detail);
    }
  },
});
</script>
<template>
  <Drawer title="修改接口"><Form /></Drawer>
</template>
