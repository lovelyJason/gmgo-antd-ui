import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'arcticons:pulse-rate-monitor',
      order: -2,
      title: $t('page.tools.title'),
    },
    name: 'SysTools',
    path: '/tools',
    children: [
      {
        name: 'ServerMonitor',
        path: 'monitor',
        component: () => import('#/views/tools/monitor/index.vue'),
        meta: {
          affixTab: true,
          icon: 'hugeicons:api',
          title: $t('page.tools.monitor'),
        },
      },
    ],
  },
];

export default routes;
