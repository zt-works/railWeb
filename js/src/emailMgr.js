
var email=(function(config){

    return {
        deleteEmail:function(el){
            config.showBlackout();
            $.ajax({
                url:config.ajaxUrls.deleteEmail,
                type:"post",
                dataType:"json",
                data:{
                    email:el.attr("href")
                },
                success:function(data){
                    if(data.success){
                        config.hideBlackout();
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        el.parents("tr").remove();
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
            var email=$("#email").val();
            var fullname=$("#fullname").val();

            if(email&&fullname){
                config.showBlackout();
                var me=this;
                el.ajaxSubmit({
                    dataType:"json",
                    success:function(data){
                        if(data.success){
                            $().toastmessage("showSuccessToast",config.message.optSuccess);

                            var tpl=$("#emailTrTpl").html();
                            var html=juicer(tpl,{
                                "email":email,
                                "fullname":fullname
                            });

                            $("#emailTable tbody").append(html);

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
                $().toastmessage("showErrorToast",config.message.inputEmailAndFullname);
            }
        }
    }
})(config);

$(document).ready(function(){

    //单个标记,删除;使用事件委托
    $("#emailTable").on("click","a.delete",function(){
        if(confirm("确定删除吗？")){
            email.deleteEmail($(this));
        }


        return false;
    });

    $("#emailCreateForm").submit(function(){

        email.submitForm($(this));

        return false;
    });
});

