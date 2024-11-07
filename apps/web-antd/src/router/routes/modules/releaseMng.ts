import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'arcticons:pulse-rate-monitor',
      order: -2,
      title: $t('page.releaseMng.title'),
    },
    name: 'ReleaseMng',
    path: '/release',
    children: [
      {
        name: 'RemoteConfig',
        path: 'remote-config',
        component: () => import('#/views/releaseMng/remoteConfig/index.vue'),
        meta: {
          affixTab: true,
          icon: 'hugeicons:api',
          title: $t('page.releaseMng.remoteConfig'),
        },
      },
    ],
  },
];

export default routes;
