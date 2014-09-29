/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-5-21
 * Time: 上午9:07
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-2-22
 * Time: 上午9:43
 * To change this template use File | Settings | File Templates.
 */
var chargeMgr=(function(config){
    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#chargeTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllCharge,
            "bInfo":true,
            "bLengthChange": false,
            "bFilter": false,
            "bSort":false,
            "bAutoWidth": false,
            "iDisplayLength":config.perLoadCount.table,
            "sPaginationType":"full_numbers",
            "oLanguage": {
                "sUrl":"js/de_DE.txt"
            },
            "aoColumns": [
                { "mDataProp": "packName"},
                { "mDataProp": "fullname"},
                { "mDataProp": "mobile"},
                { "mDataProp": "quota"}
            ] ,
            "fnServerParams": function ( aoData ) {

                aoData.push({
                    "name": "content",
                    "value":  $("#searchContent").val()
                });
            },
            "fnServerData": function(sSource, aoData, fnCallback) {

                //回调函数
                $.ajax({
                    "dataType":'json',
                    "type":"get",
                    "url":sSource,
                    "data":aoData,
                    "success": function (response) {
                        if(response.success===false){
                            config.ajaxReturnErrorHandler(response);
                        }else{
                            fnCallback(response);
                        }

                    }
                });
            },
            "fnFormatNumber":function(iIn){
                return iIn;
            }
        });

        return ownTable;
    }
    return {
        ownTable:null,
        createTable:function(){
            this.ownTable=createTable();
        },
        tableRedraw:function(){
            this.ownTable.fnSettings()._iDisplayStart=0;
            this.ownTable.fnDraw();
        }
    }
})(config);

$(document).ready(function(){

    chargeMgr.createTable();

    $("#searchContent").keydown(function(e){
        if(e.which==13){
            chargeMgr.tableRedraw();
            //$(this).val("");
        }
    });
});

