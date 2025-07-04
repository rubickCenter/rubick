import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno()],
  rules: [
    [
      /^wh-(\d+)(.*)?$/,
      (match, raw) => {
        if (!match.input) return;
        const isImportant = raw.rawSelector.endsWith('!');
        const im = isImportant ? ' !important' : '';
        const imn = isImportant ? '\\!' : '';
        const t1 = match.input.split('.').join('\\.');
        const t2 = t1.replace('%', '\\%');
        match[2] = match[2] || 'px';
        return `.${t2}${imn} {
          width: ${match[1]}${match[2].replace('per', '%')}${im};
          height: ${match[1]}${match[2].replace('per', '%')}${im};
        }`;
      }
    ],
    [
      /^translate-(x|y)-(-?\d+)(.*)?$/,
      match => {
        if (!match.input) return;
        match[3] = match[3] || 'px';
        match[3] = match[3].replace('per', '%');
        return `.${match.input} {
          transform: translate${match[1].toUpperCase()}(${match[2]}${match[3]});
        }`;
      }
    ],
    [
      /^font-size-(\d+)(.*)?$/,
      match => {
        if (!match.input) return;
        match[2] = match[2] || 'rem';
        if (match[2] === '%') return;
        return `.${match.input} {
          font-size: ${match[1]}${match[2]};
        }`;
      }
    ],
    [
      /^grid-area-(.*)?$/,
      match => {
        if (!match.input) return;
        return `.${match.input} {
          grid-area: ${match[1]};
        }`;
      }
    ],
    ['color-primary', { color: 'rgb(var(--primary-color))' }],
    ['text-primary', { color: 'rgb(var(--primary-color))' }],
    ['border-primary', { 'border-color': 'rgb(var(--primary-color))' }],
    ['bg-primary', { 'background-color': 'rgb(var(--primary-color))' }],
    ['ellipsis', { overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }],
    ['content-box', { 'box-sizing': 'content-box' }]
  ],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'flex-2': 'flex-grow-2 flex-shrink-2 flex-basis-0',
    'i-flex-center': 'inline-flex justify-center items-center',
    'i-flex-x-center': 'inline-flex justify-center',
    'i-flex-y-center': 'inline-flex items-center',
    'flex-col': 'flex flex-col',
    'flex-col-stretch': 'flex-col items-stretch',
    'i-flex-col': 'inline-flex flex-col',
    'i-flex-col-stretch': 'i-flex-col items-stretch',
    'flex-1-hidden': 'flex-1 overflow-hidden',
    'absolute-lt': 'absolute left-0 top-0',
    'absolute-lb': 'absolute left-0 bottom-0',
    'absolute-rt': 'absolute right-0 top-0',
    'absolute-rb': 'absolute right-0 bottom-0',
    'absolute-tl': 'absolute-lt',
    'absolute-tr': 'absolute-rt',
    'absolute-bl': 'absolute-lb',
    'absolute-br': 'absolute-rb',
    'absolute-center': 'absolute-lt flex-center wh-full',
    'fixed-lt': 'fixed left-0 top-0',
    'fixed-lb': 'fixed left-0 bottom-0',
    'fixed-rt': 'fixed right-0 top-0',
    'fixed-rb': 'fixed right-0 bottom-0',
    'fixed-tl': 'fixed-lt',
    'fixed-tr': 'fixed-rt',
    'fixed-bl': 'fixed-lb',
    'fixed-br': 'fixed-rb',
    'fixed-center': 'fixed-lt flex-center wh-full',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden text-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out'
  }
});
