import type { App } from 'vue';

import { Button, Input, Layout, List, Select } from 'ant-design-vue';

export function registerGlobComp(app: App) {
  app.use(Input).use(Select).use(Button).use(Layout).use(List);
}
