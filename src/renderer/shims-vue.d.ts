/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'main' {
  export function main (): any
}

declare const __static: string

declare module 'lodash.throttle'
