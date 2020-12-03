// 保存位置信息
export function saveLocation(text) {
  let name = new Date().toISOString() + '.gizmo';
  const file = new File([JSON.stringify(text)], name, {
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
      }
    });
  });


  // input.addEventListener('change', (e) => {
  //   const reader = new FileReader();
  //   const file = e.target.files[0];

  //   if (/\.gizmo/.test(file.name)) {
  //     reader.readAsText(file);
  //   } else {
  //     console.error('请选取后缀为 .gizmo 的文件导入');
  //   }

  //   reader.onerror = () => {
  //     console.error('error when import file');
  //   }

  //   reader.onload = () => {
  //     callback(JSON.parse(reader.result));
  //   }
  // });


}