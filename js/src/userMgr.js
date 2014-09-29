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
var userMgr=(function(config){
    var roles={
        "proxy":"代理",
        "admin":"管理员"
    };
    var role="";

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#userTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllUser,
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
                { "mDataProp": "username"},
                { "mDataProp": "fullname"},
                { "mDataProp": "mobile"},
                { "mDataProp": "role",
                    "fnRender":function(oObj){
                        return roles[oObj.aData.role];
                    }
                },
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {

                        return "<a href='s/user/edit/"+oObj.aData.id+"'>修改</a>&nbsp;"+
                            "<a href='"+oObj.aData.id+"' class='delete'>删除</a>";
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {

                aoData.push({
                    "name": "userInfo",
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
        roleClickHandler:function(el){
            if(el.hasClass("active")){
                role="";
                el.removeClass("active");
            }else{
                role=el.data("role");
                $(".role").removeClass("active");
                el.addClass("active");
            }

            this.tableRedraw();
        },
        deleteUser:function(id){
            config.showBlackout();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deleteUser+"/"+id,
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

    userMgr.createTable();

    $("#searchContent").keydown(function(e){
        if(e.which==13){
            userMgr.tableRedraw();
            //$(this).val("");
        }
    });

    //角色点击
    $(".role").click(function(){
        userMgr.roleClickHandler($(this));

        return false;
    });

    $("#userTable").on("click","a.delete",function(){
        if(confirm("确定删除吗？")){
            userMgr.deleteUser($(this).attr("href"));
        }


        return false;
    });

});

