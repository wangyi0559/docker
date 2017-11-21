/*
*用于获取页面间传递的参数
*/
function getParams(key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  }
  return null;
};
/*
*判断浏览器内核
*/
var idTmr;
function getExplorer()
{
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
  return "Chrome";
 }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    else {
        return "ie";
    }; //判断是否IE浏览器
}
/*
*table转为excel下载函数
*/
function table2excel(tableid)
{ //整个表格拷贝到EXCEL中
    if (getExplorer() == 'ie')
    {
        var elTable = document.getElementById(tableid); //table1改成你的tableID
        var oRangeRef = document.body.createTextRange();
        oRangeRef.moveToElementText(elTable);
        oRangeRef.execCommand("Copy");
        try {
            var appExcel = new ActiveXObject("Excel.Application");        } catch (e) {
            alert("无法调用Office对象，请确保您的机器已安装了Office并已将本系统的站点名加入到IE的信任站点列表中！");
            return;
        }
        appExcel.Visible = true;
        appExcel.Workbooks.Add().Worksheets.Item(1).Paste();
        appExcel = null;
        
    }
    else
    {
        tableToExcel(tableid)
    }
}
function Cleanup()
{
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function ()
{
    var uri = 'data:text/xls;charset=utf-8,\ufeff,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function (s)
    {
        return window.btoa(encodeURIComponent(s))
    },
    format = function (s, c)
    {
        return s.replace(/{(\w+)}/g,
            function (m, p)
        {
            return c[p];
        }
        )
    }
    return function (table, name)
    {
        if (!table.nodeType)
            table = document.getElementById(table)
                var ctx =
            {
                worksheet : name || 'Worksheet',
                table : table.innerHTML
            }
        //window.location.href = uri + base64(format(template, ctx))
        
        var downloadLink = document.createElement("a");
        downloadLink.href = uri + format(template, ctx);
        downloadLink.download = '统计.xls';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
)()
/*
*输出main-footer信息
*/
function mainFooter(){
    document.write('<footer class="main-footer">'
    +'<div class="hidden-xs">'
      +'<p class="text-center">Copyright ©2017 苏州同济金融科技研究院有限公司</p></div>'
  +"</footer>");
}
/*
*输出sidebar-menu
*/
function sidebarMenu(){
    document.write('<ul class="sidebar-menu" data-widget="tree">'
        +'<li class="header">导航</li>'
        +'<li class="active treeview">'
          +'<a href="#"><i class="fa fa-bookmark"></i> <span>精准识别</span>'
            +'<span class="pull-right-container">'
                +'<i class="fa fa-angle-left pull-right"></i>'
              +"</span>"
          +"</a>"
          +'<ul class="treeview-menu">'
            +'<li><a href="../../aI/monitorAuditM/monitorAudit.html">检查审核管理</a></li>'
            +'<li><a href="../../aI/publicityAuditM/publicityAudit.html">公示审核管理</a></li>'
            +'<li><a href="../../aI/lowIncomeLM/lowILM.html">低收入名单管理</a></li>'
            +'<li><a href="../../aI/integrityInquiries/iInquiry.html">诚信查询</a></li>'
             +"</ul>"
        +"</li>"
                +'<li class="active treeview">'
          +'<a href="#"><i class="fa fa-database"></i> <span>系统维护</span>'
            +'<span class="pull-right-container">'
                +'<i class="fa fa-angle-left pull-right"></i>'
              +"</span>"
          +"</a>"
          +'<ul class="treeview-menu">'
            +'<li><a href="../../sM/iMaintenance/iMaintenance.html">机构维护</a></li>'
            +'<li><a href="../../sM/uMaintenance/uMaintenance.html">用户维护</a></li>'
          +"</ul>"
        +"</li>"
      +"</ul>");}
 /*
*输出医疗救助的sidebar-menu
*/
function sidebarMenu_2(){
    document.write('<ul class="sidebar-menu" data-widget="tree">'
        +'<li class="header">导航</li>'
        +'<li class="active treeview">'
          +'<a><i class="fa fa-bookmark"></i> <span>医疗救助</span>'
            +'<span class="pull-right-container">'
                +'<i class="fa fa-angle-left pull-right"></i>'
              +"</span>"
          +"</a>"
          +'<ul class="treeview-menu">'
            +'<li><a href="../../mA/mA/medicAid.html">医疗救助</a></li>'
            +'<li><a href="#">救助名单</a></li>'
            +'<li><a href="../../mA/costList/costList.html">费用清单</a></li>'
            +'<li><a href="../../aI/lowIncomeLM/lowILM.html">费用结算</a></li>'
             +"</ul>"
        +"</li>"
        +'<li class="active treeview">'
          +'<a><i class="fa fa-bookmark"></i> <span>低保保障</span>'
            +'<span class="pull-right-container">'
                +'<i class="fa fa-angle-left pull-right"></i>'
              +"</span>"
          +"</a>"
          +'<ul class="treeview-menu">'
            +'<li><a href="../../lS/lS/lowSecurity.html">低保保障</a></li>'
            +'<li><a href="../../aI/monitorAuditM/monitorAudit.html">发放计划</a></li>'
            +'<li><a href="../../aI/publicityAuditM/publicityAudit.html">补助信息</a></li>'
            +'<li><a href="../../aI/lowIncomeLM/lowILM.html">帮扶政策</a></li>'
             +"</ul>"
        +"</li>"
        +'<li class="active treeview">'
          +'<a><i class="fa fa-bookmark"></i> <span>监督监管</span>'
            +'<span class="pull-right-container">'
                +'<i class="fa fa-angle-left pull-right"></i>'
              +"</span>"
          +"</a>"
          +'<ul class="treeview-menu">'
            +'<li><a href="../../aI/monitorAuditM/monitorAudit.html">监督监管</a></li>'
             +"</ul>"
        +"</li>"
                +'<li class="active treeview">'
          +'<a href="#"><i class="fa fa-database"></i> <span>系统维护</span>'
            +'<span class="pull-right-container">'
                +'<i class="fa fa-angle-left pull-right"></i>'
              +"</span>"
          +"</a>"
          +'<ul class="treeview-menu">'
            +'<li><a href="../../sM/iMaintenance/iMaintenance.html">机构维护</a></li>'
            +'<li><a href="../../sM/uMaintenance/uMaintenance.html">用户维护</a></li>'
          +"</ul>"
        +"</li>"
      +"</ul>");}