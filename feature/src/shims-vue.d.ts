/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'axios'

interface Window {
  rubick: any;
  market: any
}

namespace Market {
  interface Plugin {
    isdownload?: boolean;
    name?: string;
    isloading: boolean
  }
}
