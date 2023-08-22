import { createI18n } from 'vue-i18n';
import messages from './langs';
import localConfig from '@/confOp';
const { perf }: any = localConfig.getConfig();

// 2. Create i18n instance with options
const i18n = createI18n({
  legacy: false,
  locale: perf.common.lang || 'zh-CN', // set locale
  fallbackLocale: 'zh-CN', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
});

export default i18n;
