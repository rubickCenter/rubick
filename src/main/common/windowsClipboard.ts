import { clipboard } from 'electron';
import path from 'path';

type ClipboardExModule = typeof import('electron-clipboard-ex');

const DROPFILES_HEADER_SIZE = 20;

let clipboardExModule: ClipboardExModule | null = null;

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

const buildWindowsFileListPayload = (files: string[]): Buffer =>
  Buffer.from(`${files.join('\0')}\0\0`, 'utf16le');

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

