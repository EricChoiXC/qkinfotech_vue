const pdfInfoModel =
'<div class="page">'+
    '<div style="display: flex;align-items: center;height: 50px;">'+
      '<div class="blue-square">'+
        '<div class="text-container">'+
          '${index}'+
        '</div>'+
      '</div>'+
      '<div class="text-right">'+
        '申请人基本情况介绍'+
      '</div>'+
    '</div>'+
    '<div class="container">'+
      '<div class="item" style="height: 100%;">'+
        '<div>单位注册名称：${fCompanyName}</div><br>'+
        '<div>国别：${fCountry}</div><br>'+
        '<div>法定代表人：${fLegalRepresentative}</div><br>'+
        '<div>公司注册地址：${fCompanyRegisteredAddress}</div><br>'+
        '<div>公司成立日期：${fIncorporationTime}</div><br>'+
        '<div>公司电话：${fCompanyPhone}</div><br>'+
        '<div>官网地址：${fOfficialWebsiteAddress}</div><br>'+
        '<div>设计人员总数：【${fDesignersTotal}】人,其中注册建筑/景观设计师【${fRegisteredArchitectsOrLandscapeArchitects}】人'+
        '</div>'+
      '</div>'+
      '<div class="item" style="height: 70%;">'+
        '<div>本项目联系人：${fContactPerson}</div><br>'+
        '<div>职务：${fDuties}</div><br>'+
        '<div>电话：${fPhone}</div><br>'+
        '<div>邮箱：${fEmail}</div><br>'+
        '<div>通信地址及邮编：${fMailingAddressAndPostcode}</div><br>'+
      '</div>'+
      '<div class="item" style="height: 100%;justify-content: center;">'+
        '<div>商业登记/营业执照编号：${fBusinessregistrationbusinesslicensenumber}</div><br><br>'+
        '<div>设计资格或资质的种类/级别：${fDesignQualificationTypeOrLevel}</div>'+
      '</div>'+
      '<div class="item" style="margin-top: -170px;">'+
        '<div>公司介绍：${fCompanyProfile}</div>'+
      '</div>'+
    '</div>'+
  '</div>'

export default pdfInfoModel;
