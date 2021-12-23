// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function throttle(func, wait, options?: any): () => void {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return () => {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    const remaining = wait - (now - previous);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context = this;
    // eslint-disable-next-line prefer-rest-params
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
