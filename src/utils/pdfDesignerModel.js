const pdfDesignerModel =
'<div class="page">'+
    '<div style="display: flex;align-items: center;height: 50px;">'+
      '<div class="blue-square">'+
        '<div class="text-container">'+
        '${index}'+
        '</div>'+
      '</div>'+
      '<div class="text-right">'+
        '【${companyName}+${personName}】'+
      '</div>'+
    '</div>'+
    '<div class="designer">'+
      '<div class="item" style="border: 5px dashed rgb(32, 56, 100); "><img src="data:image/png;base64,${designerSrc}" style="max-width: 400px;max-height: 400px;" /></div>'+
      '<div class="item" style="font-size: 12pt;">'+
        '<table style="width:100%;height: 100%;text-align: center; overflow: auto;position: relative;border: 4px solid rgb(32, 56, 100);">'+
          '<tr>'+
            '<td style="width: 25%;">职称/执业资格</td>'+
            '<td style="width: 25%;">${level}</td>'+
            '<td style="width: 25%;">从业年限</td>'+
            '<td style="width: 25%;">${years}</td>'+
          '</tr>'+
          '<tr>'+
            '<td style="width: 25%;">'+
              '曾获国内或国际设计奖项'+
            '</td>'+
            '<td colspan="3">'+
              '<p>'+
              '${winning}'+
              '</p>'+
            '</td>'+
          '</tr>'+
          '<tr>'+
            '<td style="width: 25%;">'+
              '主创同类设计业绩'+
            '</td>'+
            '<td colspan="3">'+
              '<p>'+
                '${creators}'+
              '</p>'+
            '</td>'+
          '</tr>'+
        '</table>'+
      '</div>'+
      '<div class="item" style="font-size: 13pt;">'+
        '<div>项目名称：${name}</div>'+
        '<div>项目地点：${place}</div>'+
        '<div>业主名称：${owner}</div>'+
        '<div>规模：${scale}</div>'+
        '<div>功能：${function}</div>'+
        '<div>服务起止时间：${time}</div>'+
        '<div>项目现状：${status}</div>'+
        '<div>所承担的服务内容：${remarks}</div>'+
      '</div>'+
      '<div class="item" style="border: 5px dashed rgb(32, 56, 100); display: flex; flex-direction: column;flex-wrap: wrap;">'+
        '<div style="width: 50%; height: 100%; object-fit: cover; object-position: center; display: flex">' +
          '<img src="data:image/png;base64,${itemSrc1}" style="max-width: 100%;max-height: 100%" />'+
        '</div>' +
        '<div style="width: 50%; height: 100%; object-fit: cover; object-position: center; display: flex">' +
          '<img src="data:image/png;base64,${itemSrc2}" style="max-width: 100%;max-height: 100%" />'+
        '</div>' +
      '</div>'+
    '</div>'+
  '</div>'
export default pdfDesignerModel;
