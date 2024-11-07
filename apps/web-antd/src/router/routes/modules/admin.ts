import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('page.system.title'),
    },
    name: 'Admin',
    path: '/admin',
    children: [
      {
        name: 'SysApiManage',
        path: 'sys-api',
        component: () => import('#/views/admin/sys-api/index.vue'),
        meta: {
          affixTab: true,
          icon: 'hugeicons:api',
          title: $t('page.system.api'),
        },
      },
      {
        name: 'SysUserManage',
        path: 'user',
        component: () => import('#/views/admin/user/index.vue'),
        meta: {
          affixTab: true,
          icon: 'material-symbols:account-circle-full',
          title: $t('page.system.user'),
        },
      },
      {
        name: 'SysRoleManage',
        path: 'role',
        component: () => import('#/views/admin/role/index.vue'),
        meta: {
          affixTab: true,
          icon: 'oui:app-users-roles',
          title: $t('page.system.role'),
        },
      },
      {
        name: 'SysMenuManage',
        path: 'menu',
        component: () => import('#/views/admin/menu/index.vue'),
        meta: {
          affixTab: true,
          icon: 'material-symbols:menu-book-sharp',
          title: $t('page.system.menu'),
        },
      },
      {
        name: 'SysDeptManage',
        path: 'dept',
        component: () => import('#/views/admin/dept/index.vue'),
        meta: {
          affixTab: true,
          icon: 'mingcute:department-line',
          title: $t('page.system.department'),
        },
      },
    ],
  },
];

export default routes;
