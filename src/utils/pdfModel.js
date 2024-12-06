const pdfModel =
'<html lang="en">'+
  '<head>'+
    '<script type="module" src="/@vite/client"></script>'+
    '<style>'+
    '@media screen {'+
      '.preview { zoom:80%}'+
      '.page {'+
        'page-break-after: always;'+
        'position:relative;'+
        'height: 254mm;'+
        'width: 452mm;'+
        'overflow: hidden;'+
        'box-sizing: border-box;'+
        'background-color: #fafafa;'+
        'border: 1px solid lightgray;'+
        'margin-bottom: 5mm;'+
        'margin-right: auto;'+
        'margin-left: auto;'+
      '}'+
    '}'+
    '.designer {'+
      'margin: auto;'+
      'width: 91%;'+
      'height: 90%;'+
      'display: grid;'+
      'grid-Template-Columns: 30% 70%;'+
      'grid-template-rows: 50%;'+
      'grid-gap: 3mm;'+
      'padding: 20px;'+
    '}'+
    '.container {'+
      'margin: auto;'+
      'width: 93%;'+
      'height: 90%;'+
      'display: grid;'+
      'grid-template-columns: repeat(2, 1fr);'+
      'grid-gap: 3mm;'+
      'padding: 20px;'+
    '}'+
    '.item {'+
      'border: 4px solid rgb(32, 56, 100);'+
      'overflow: hidden;'+
      'display: flex;'+
      'flex-direction: column;'+
      'padding: 8px;'+
      'box-sizing: border-box;'+
    '}'+
    '.item>div {'+
      'margin-bottom: 6px;'+
      'font-size: 16.5pt;'+
    '}'+
    '.blue-square {'+
      'width: 50px;'+
      'height: 50px;'+
      'background-color: rgb(32, 56, 100);'+
      'position: absolute;'+
      'top: 0;'+
      'left: 0;'+
      'display: flex;'+
      'justify-content: center;'+
      'align-items: center;'+
    '}'+
    '.text-container {'+
      'color: white;'+
      'font-size: 27px;'+
      'font-weight: bold;'+
      'text-align: center;'+
    '}'+
    '.text-right {'+
      'font-size: 23.5pt;'+
      'margin-left: 15mm;'+
      'color: rgb(47, 85, 151);'+
      'font-weight: bold;'+
    '}'+
    'table { border-collapse: collapse; }'+
    'th, td ,tr{'+
      'border: 2px solid rgb(32, 56, 100);'+
      'padding: 8px;' +
    '}'+
    'img { margin:auto }'+
    '@media print {'+
      '@page {'+
        'size: 452mm 254mm;'+
        'margin: 0 !important;'+
        'padding: 0 !important;'+
      '}'+
      'body {' +
        '-webkit-print-color-adjust: exact;'+
        '-moz-print-color-adjust: exact;'+
        '-ms-print-color-adjust: exact;'+
        'print-color-adjust: exact;'+
      '}'+
      '.page {'+
        'page-break-before: always;'+
        'page-break-inside: avoid;'+
        'page-break-after: always;'+
        'position:relative;'+
        'height: 254mm;'+
        'width: 452mm;'+
        'overflow: hidden;'+
        'background-color: #fafafa;'+
        'box-sizing: border-box;'+
        'margin: 0;'+
      '}'+
    '}'+
      'body,div {'+
        'margin: 0;'+
        'padding: 0;'+
        'position: relative;'+
        'font-family: "Microsoft YaHei", sans-serif;'+
      '}'+
    '</style>'+
    '<meta charset="UTF-8">'+
	'</head>'+
  '<body>'+
  '<div class="preview">'+
    '<div class="page">' +
      '<div style="display: grid;grid-template-columns: 40mm 140mm auto;gap: 1mm;margin-top: 1.5%;">' +
        '<div style="width: 37.6mm;height: 240mm;background-color: rgb(32, 56, 100);">'+
          '</div>' +
          '<div style="height: 240mm;">'+
            '<p style="color: rgb(47, 85, 151);font-size: 27.5pt;font-weight: bold;display: flex;justify-content: center;margin-top: 47%;">【${title}】</p>' +
            '<p style="margin-top: 415px;color: rgb(47, 85, 151);font-size: 23.5pt;font-weight: bold;display: flex;justify-content: center;margin-top: 75%;">资 格 预 审 申 请 文 件</p>' +
          '</div>' +
          '<div style="height: 240mm; background-color: rgb(77, 96, 131); display: flex; flex-direction: column; justify-content: flex-end;">' +
           '<div class="vertical-element" style="width: 0.08cm; height: 13.95cm; background-color: white; position: absolute; top: 0; left: 25px;"></div>'+
            '<div style="width: 90%; height: 15mm; background-color: white; margin-left: 20mm;margin-bottom: 20mm;">' +
              '<p style="color: rgb(47, 85, 151);font-size: 22pt;font-weight: bold;margin: 11px;">申请人:${name}</p>'+
             '</div>'+
          '</div>'+
        '</div>'+
    '</div>'+
    '${infos}' +
    '${designer}'+
    '${item}'+
   '</div>'+
	'</body>'+
'</html>'


export default pdfModel;
