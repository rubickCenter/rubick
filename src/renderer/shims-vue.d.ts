/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "main" {
  export function main(): any;
}

declare const __static: string;

declare module "lodash.throttle";

interface Window {
  setSubInput: ({ placeholder }: { placeholder: string }) => void;
  setSubInputValue: ({ value }: { value: string }) => void;
  removeSubInput: () => void;
  loadPlugin: (plugin: any) => void;
  updatePlugin: (plugin: any) => void;
  initRubick: () => void;
  setCurrentPlugin: (plugin: any) => void;
  pluginLoaded: () => void;
  getMainInputInfo: () => any;
}
