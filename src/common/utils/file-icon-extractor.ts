import shell from 'node-powershell';

function registerShell() {
  return new shell({
    executionPolicy: 'Bypass',
    noProfile: true
  });
}

const extract = async (filePath, outputPath, format = 'png') => {
  const ps = registerShell();
  ps.addCommand(`Add-Type -AssemblyName System.Drawing`);

  // 提取图标并保存到文件
  ps.addCommand(`
    $icon = [System.Drawing.Icon]::ExtractAssociatedIcon('${filePath}')
    $bitmap = $icon.ToBitmap()
    $outputPath = '${outputPath.replace(/'/g, "''")}'  # 转义单引号
    $imageFormat = [System.Drawing.Imaging.ImageFormat]::${format.toUpperCase()}
    $bitmap.Save($outputPath, $imageFormat)
    $bitmap.Dispose()
    $icon.Dispose()
  `);

  try {
    await ps.invoke();
    ps.dispose();
    return outputPath;
  } catch (err) {
    console.error('提取图标失败:', filePath);
    ps.dispose();
    throw err;
  }
};

export default extract;
