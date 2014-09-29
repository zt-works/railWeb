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
var orderMgr=(function(config){
    var checkResult={
        1:"待处理",
        2:"已处理",
        3:"废弃"
    };
    var effect={
        0:"当月生效",
        1:"次月生效"
    };
    var currentEditId=0;
    var packTypes={
        1:"宽带",
        2:"光纤",
        3:"TD无线固话"
    };
    var loadedObj={};

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#orderTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllOrder,
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
                { "mDataProp": "itemContact"},
                { "mDataProp": "itemMobile"},
                { "mDataProp": "itemAddress"},
                { "mDataProp": "category"},
                { "mDataProp": "packName"},
                { "mDataProp": "submitterFullname"},
                { "mDataProp": "checkResult","sClass":"checkResult"},
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {
                        var string="<a class='checkDetail' href='"+oObj.aData.orderItemId+"'>详情</a>&nbsp;";

                        if(oObj.aData.checkResult==checkResult["1"]){
                            string+="<a class='opt' href='"+oObj.aData.orderItemId+"'>处理</a>";
                        }

                        return string;

                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {

                aoData.push({
                    "name": "itemInfo",
                    "value":  $("#searchContent").val()
                },{
                    "name": "category",
                    "value": $("#categorySelect").val()
                },{
                    "name": "packId",
                    "value": ""/*$("#packSelect").val()*/
                },{
                    "name": "submitterId",
                    "value": $("#userSelect").val()
                },{
                    "name": "startDate",
                    "value": $("#startDate").val()
                },{
                    "name": "endDate",
                    "value": $("#endDate").val()
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
                                response.aaData[i].category=packTypes[response.aaData[i].category];
                                response.aaData[i].checkResult=checkResult[response.aaData[i].checkResult];

                                response.aaData[i].itemMemo=JSON.parse(response.aaData[i].itemMemo);

                                if(response.aaData[i].itemMemo.effect!==undefined){
                                    response.aaData[i].itemMemo.effect=effect[response.aaData[i].itemMemo.effect];
                                }


                                //记录下加载的数据，以便显示详情
                                loadedObj[response.aaData[i]["orderItemId"]]=response.aaData[i]
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
            loadedObj={};
            this.ownTable.fnSettings()._iDisplayStart=0;
            this.ownTable.fnDraw();
        },
        deleteOrder:function(id){
            config.showBlackout();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deleteOrder+"/"+id,
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
        allDataHandler:function(){
            $("#searchContent").val("");
            $(".dateInput").val("");
            $(".searchSelect").val("");

            this.tableRedraw();
        },
        checkDetailHandler:function(id){
            var tpl=$("#orderDetailTpl").html();
            var html=juicer(tpl,loadedObj[id]);
            $("#popWindowContent").html(html);
            $("#popWindow,#blackout").removeClass("hidden");

        },
        optHandler:function(id){
            currentEditId=id;
            var tpl=$("#optFormTpl").html();
            var html=juicer(tpl,{orderId:id});
            $("#popWindowContent").html(html);
            $("#popWindow,#blackout").removeClass("hidden");
        },
        optFormSubmit:function(el){
            loadedObj[currentEditId]["itemMemo"]["memo"]=$("#memo").val();

            el.ajaxSubmit({
                dataType:"json",
                data:{
                    itemMemo:JSON.stringify(loadedObj[currentEditId]["itemMemo"])
                },
                success:function(data){
                    if(data.success){
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        var result=checkResult[$("#checkResult").val()];
                        loadedObj[currentEditId]["checkResult"]=result;

                        //更新表格数据
                        var optEl=$(".opt[href='"+currentEditId+"']");
                        optEl.parents("tr").find(".checkResult").text(result);
                        optEl.remove();

                        el.clearForm();

                        $("#popWindow,#blackout").addClass("hidden");
                    }else{
                        config.ajaxReturnErrorHandler(data);
                        loadedObj[currentEditId]["itemMemo"]["memo"]="";
                    }
                },
                error:function(){
                    config.ajaxErrorHandler();
                    loadedObj[currentEditId]["itemMemo"]["memo"]="";
                }
            });
        },
        initSelect:function(type){
            $.ajax({
                url:type=="pack"?config.ajaxUrls.getAutoCompletePack:config.ajaxUrls.getAutoCompleteUser,
                type:"get",
                dataType:"json",
                success:function(data){
                    var tpl=$("#selectElTpl").html();

                    var html=juicer(tpl,data);
                    if(type=="pack"){
                        $("#packSelect").html(html);
                    }else{
                        $("#userSelect").html(html);
                    }
                }
            })
        },
        initSelects:function(){
            //this.initSelect("pack");
            this.initSelect("user");
        }
    }
})(config);

$(document).ready(function(){

    orderMgr.createTable();
    orderMgr.initSelects();


    $(".dateInput").date_input();

    $("#allData").click(function(){
         orderMgr.allDataHandler();
    });
    $("#searchBtn").click(function(){
        orderMgr.tableRedraw();
    });

    $("#popWindow").on("submit","#orderOptForm",function(){

        orderMgr.optFormSubmit($(this));

        return false;
    });

    //单个标记,删除;使用事件委托
    $("#orderTable").on("click",".checkDetail",function(){
        orderMgr.checkDetailHandler($(this).attr("href"));

        return false;
    }).on("click","a.opt",function(){
        orderMgr.optHandler($(this).attr("href"));

        return false;
    });

    $(document).keydown(function(e){
        if (e.which === 27) {
            $("#popWindow,#blackout").addClass("hidden");
        }
    });

    $("#closePopWindow,#blackout").click(function(){
        $("#popWindow,#blackout").addClass("hidden");

        return false;
    });

});

