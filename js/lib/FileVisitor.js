// 保存位置信息，参数 location 为数组对象
export function saveLocation(location) {
  if (!location) {
    return;
  }
  let name = new Date().toISOString() + '.gizmo';
  const file = new File([JSON.stringify(location)], name, {
    type: 'text/plain'
  });
  const a = document.createElement('a');

  a.href = URL.createObjectURL(file);
  a.download = file.name;
  URL.revokeObjectURL(file);

  a.click();
}

// 导入位置信息，参数为 input:file 元素
export function loadLocation(input) {
  input.click();
  return new Promise((resolve, reject) => {
    input.addEventListener('change', (e) => {
      const reader = new FileReader();
      const file = e.target.files[0];
      // console.log('file: ', file);
      if(!file) {
        reject('未选择文件');
      }
      
      if (/\.gizmo/.test(file.name)) {
        reader.readAsText(file);
      } else {
        reject('请选取后缀为 .gizmo 的文件导入');
        // console.error('请选取后缀为 .gizmo 的文件导入');
      }
  
      reader.onerror = () => {
        reject('error when import file');
      }
  
      reader.onload = () => {
        resolve(JSON.parse(reader.result));
        input.value = null;
      }
    });
  });
}