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
var areaMgr=(function(config){

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#areaTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllArea,
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
                { "mDataProp": "area"},
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {

                        return "<a class='delete' href='"+oObj.aData.id+"'>删除</a>";
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {

                aoData.push({
                    "name": "area",
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
        deleteArea:function(id){
            config.showBlackout();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deleteArea+"/"+id,
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
        },
        submitForm:function(el){
            var me=this;
            var area=$("#area").val();

            if(area){
                config.showBlackout();
                var me=this;
                el.ajaxSubmit({
                    dataType:"json",
                    success:function(data){
                        if(data.success){
                            $().toastmessage("showSuccessToast",config.message.optSuccess);

                            me.tableRedraw();

                            el.clearForm();

                            config.hideBlackout();
                        }else{
                            config.ajaxReturnErrorHandler(data);
                        }
                    },
                    error:function(){
                        config.ajaxErrorHandler();
                    }
                });
            }else{
                $().toastmessage("showErrorToast",config.message.inputArea);
            }
        }
    }
})(config);

$(document).ready(function(){

    areaMgr.createTable();

    $("#searchContent").keydown(function(e){
        if(e.which==13){
            areaMgr.tableRedraw();
            //$(this).val("");
        }
    });

    $("#areaCreateForm").submit(function(){

        areaMgr.submitForm($(this));

        return false;
    });

    $("#areaTable").on("click","a.delete",function(){
        if(confirm("确定删除吗？")){
            areaMgr.deleteArea($(this).attr("href"));
        }


        return false;
    });

});

