import { clipboard } from 'electron';
import path from 'path';

// 仅在 Windows 平台辅助操作剪贴板多文件格式。
type ClipboardExModule = typeof import('electron-clipboard-ex');

const DROPFILES_HEADER_SIZE = 20;

let clipboardExModule: ClipboardExModule | null = null;

/**
 * Windows 平台专用：尝试加载第三方库 electron-clipboard-ex。
 * 这个库能够调用系统底层接口写入“文件复制”数据，成功率更高。
 * 其他系统无需加载它，因此这里做了“按需加载”的处理。
 */
const ensureClipboardEx = (): ClipboardExModule | null => {
  if (process.platform !== 'win32') return null;
  if (clipboardExModule) return clipboardExModule;
  try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    clipboardExModule = require('electron-clipboard-ex');
  } catch {
    clipboardExModule = null;
  }
  return clipboardExModule;
};

/**
 * 把一组文件路径变成 Windows 规定的文本格式。
 * 要求：每个路径之间用单个空字符分隔，最后再额外放两个空字符，表示列表结束。
 * Windows 资源管理器会按这个格式解析我们复制到剪贴板的文件。
 */
const buildWindowsFileListPayload = (files: string[]): Buffer =>
  Buffer.from(`${files.join('\0')}\0\0`, 'utf16le');

/**
 * 构造 CF_HDROP 专用的二进制数据。
 * 这是 Windows 复制文件时的底层格式，前 20 字节是固定的结构头，
 * 后面紧跟着具体的文件路径（由 buildWindowsFileListPayload 生成）。
 * 只要把这个内容写入剪贴板，任何支持粘贴文件的程序都能理解。
 */
const buildWindowsFileDropBuffer = (files: string[]): Buffer => {
  const payload = buildWindowsFileListPayload(files);
  const header = Buffer.alloc(DROPFILES_HEADER_SIZE);
  header.writeUInt32LE(DROPFILES_HEADER_SIZE, 0);
  header.writeInt32LE(0, 4);
  header.writeInt32LE(0, 8);
  header.writeUInt32LE(0, 12);
  header.writeUInt32LE(1, 16);

  const result = Buffer.alloc(header.length + payload.length);
  for (let i = 0; i < header.length; i += 1) {
    result[i] = header[i];
  }
  for (let i = 0; i < payload.length; i += 1) {
    result[header.length + i] = payload[i];
  }
  return result;
};

/**
 * 复制/移动/创建快捷方式 等不同操作在 Windows 中对应不同的“意图”值。
 * Preferred DropEffect 告诉系统：当前剪贴板数据应该以何种方式处理。
 * 我们默认写入“copy”，相当于普通的复制粘贴。
 */
const buildDropEffectBuffer = (effect: 'copy' | 'move' | 'link' = 'copy') => {
  const effectMap = {
    copy: 1,
    move: 2,
    link: 4,
  } as const;
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(effectMap[effect], 0);
  return buffer;
};

/**
 * 直接使用 Electron 内置 API 写入多种剪贴板格式。
 * 步骤：
 * 1. 写入二进制的 CF_HDROP（含头部与路径列表）
 * 2. 写入纯文本形式的 FileNameW（备选格式）
 * 3. 写入 Preferred DropEffect（告诉系统“这是复制”）
 * 全部成功后，读取一次 CF_HDROP 的长度，确认剪贴板里确实有内容。
 */
const writeWindowsBuffers = (files: string[]): boolean => {
  try {
    clipboard.writeBuffer('CF_HDROP', buildWindowsFileDropBuffer(files));
    clipboard.writeBuffer('FileNameW', buildWindowsFileListPayload(files));
    clipboard.writeBuffer('Preferred DropEffect', buildDropEffectBuffer('copy'));
    return clipboard.readBuffer('CF_HDROP').length > 0;
  } catch {
    return false;
  }
};

/**
 * 如果项目中安装了 electron-clipboard-ex，我们优先使用它。
 * 理由：该库通过原生方式与系统交互，兼容性往往优于 Electron 的 JS 层写入。
 * 调用成功后，必要时读回文件列表做一次数量校验，确保复制的文件数量正确。
 */
const writeWithClipboardEx = (files: string[]): boolean => {
  const clipboardEx = ensureClipboardEx();
  if (!clipboardEx) return false;
  try {
    clipboardEx.writeFilePaths(files);
    if (typeof clipboardEx.readFilePaths === 'function') {
      const result = clipboardEx.readFilePaths();
      return Array.isArray(result) && result.length === files.length;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * 对外暴露的唯一入口。
 * 1. 先把所有路径换成 Windows 可识别的标准形式（path.normalize）。
 * 2. 尝试使用 electron-clipboard-ex 写入，如果成功就结束。
 * 3. 若第三方库不可用或失败，再退回 Electron 原生写入流程。
 * 这一层屏蔽了所有细节，外部调用者只需传入字符串数组即可。
 */
export const copyFilesToWindowsClipboard = (files: string[]): boolean => {
  const normalizedFiles = files
    .map((filePath) => path.normalize(filePath))
    .filter(Boolean);
  if (!normalizedFiles.length) return false;
  if (writeWithClipboardEx(normalizedFiles)) {
    return true;
  }
  return writeWindowsBuffers(normalizedFiles);
};

