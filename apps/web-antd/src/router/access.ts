import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { message } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

interface Menu {
  id: string;
  menuId: number;
  menuName: string;
  title: string;
  icon: string;
  path: string;
  paths: string;
  menuType: string;
  action: string;
  permission: string;
  parentId: number;
  component: string;
  children: Menu[];
  [key: string]: any;
}

function generateMenuList(
  routes: RouteRecordStringComponent[],
  menuList: Menu[],
) {
  menuList.forEach((item) => {
    const menu = {
      path: item.path,
      component: item.component,
      hidden: item.visible !== '0',
      children: [],
      name: item.menuName,
      meta: {
        title: item.title,
        icon: item.icon,
        noCache: item.noCache,
        hideInMenu: item.visible === '1',
        affixTab: item.menuName === 'Workspace',
      },
    };
    if (item.children) {
      generateMenuList(menu.children, item.children);
    }
    routes.push(menu);
  });
}

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      return await getAllMenusApi().then((res) => {
        const sidebarRoutes: RouteRecordStringComponent[] = [];
        // @ts-ignore 这是因为后端返回来的接口不一定完全符合路由ts类型
        generateMenuList(sidebarRoutes, res);
        return sidebarRoutes;
      });
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
