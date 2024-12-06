const pdfItemModel =
 '<div class="page">'+
    '<div style="display: flex;align-items: center;height: 50px;">'+
      '<div class="blue-square">'+
        '<div class="text-container">'+
        '${index}'+
        '</div>'+
      '</div>'+
      '<div class="text-right">'+
        '主创设计师类似项目业绩'+
      '</div>'+
    '</div>'+
    '<div class="container">'+
      '<div class="item" style="grid-row: span 2;">'+
        '<div><p style="font-size:20pt;color:rgb(32, 56, 100);text-align: center;">主创设计师业绩</p></div><br>'+
        '<div>项目名称：${name}</div><br>'+
        '<div>项目地点：${place}</div><br>'+
        '<div>业主名称：${owner}</div><br>'+
        '<div>规模：${scale}</div><br>'+
        '<div>功能：${function}</div><br>'+
        '<div>服务起止时间：${time}</div><br>'+
        '<div>项目现状：${status}</div><br>'+
        '<div>所承担的服务内容：${remarks}</div><br>'+
      '</div>'+
      '<div class="item" style="border: 5px dashed rgb(32, 56, 100); ">'+
        '<div style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: flex">' +
          '<img src="data:image/png;base64,${itemSrc1}" style="max-width: 100%;max-height: 100%" />'+
        '</div>' +
      '</div>'+
      '<div class="item" style="border: 5px dashed rgb(32, 56, 100); ">'+
        '<div style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: flex">' +
          '<img src="data:image/png;base64,${itemSrc2}" style="max-width: 100%;max-height: 100%" />'+
        '</div>' +
      '</div>'+
    '</div>'+
'</div>';

export default pdfItemModel;
