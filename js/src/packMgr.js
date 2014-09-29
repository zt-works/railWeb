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
var packMgr=(function(config){
    var packTypes={
        1:"宽带",
        2:"光纤",
        3:"TD无线固话"
    };

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#packTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllPack,
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
                { "mDataProp": "name"},
                { "mDataProp": "category",
                    "fnRender":function(oObj){
                        return packTypes[oObj.aData.category];
                    }},
                { "mDataProp": "bandwidth"},
                { "mDataProp": "price"},
                { "mDataProp": "duration"},
                { "mDataProp": "detail"},
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {

                        return "<a href='s/bizPack/edit/"+oObj.aData.id+"'>修改</a>&nbsp;"+
                            "<a href='"+oObj.aData.id+"' class='delete'>删除</a>";
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {

                aoData.push({
                    "name": "name",
                    "value":  $("#searchContent").val()
                },{
                    "name":"category",
                    "value":$("#category").val()
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
                            var json = {
                                "sEcho" : response.sEcho
                            };
                            for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                                response.aaData[i].opt="opt";
                            }

                            json.aaData=response.aaData;
                            json.iTotalRecords = response.iTotalRecords;
                            json.iTotalDisplayRecords = response.iTotalDisplayRecords;
                            fnCallback(json);
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
        },
        deletePack:function(id){
            config.showBlackout();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deletePack+"/"+id,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.success){
                        config.hideBlackout();
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        me.ownTable.fnDraw();
                    }else{
                        config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                    config.ajaxErrorHandler();
                }
            });
        }
    }
})(config);

$(document).ready(function(){

    packMgr.createTable();

    $("#searchContent").keydown(function(e){
        if(e.which==13){
            packMgr.tableRedraw();
            //$(this).val("");
        }
    });

    $("#category").change(function(){
        packMgr.tableRedraw();
    });

    $("#packTable").on("click","a.delete",function(){
        if(confirm("确定删除吗？")){
            packMgr.deletePack($(this).attr("href"));
        }

        return false;
    });

});

