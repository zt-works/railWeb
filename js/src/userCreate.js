/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-5-21
 * Time: 上午9:12
 * To change this template use File | Settings | File Templates.
 */
var userCreate=(function(){
    return {
        formSubmit:function(form){
            config.showBlackout();
            $(form).ajaxSubmit({
                dataType:"json",
                success:function(data){
                    if(data.success){
                        //config.hideBlackout();
                        $().toastmessage("showSuccessToast",config.message.optSuccRedirect);
                        config.redirect(config.urls.userMgr);
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
})();
$(document).ready(function(){
    $("#userCreateForm").validate({
        rules: {
            username:{
                required:true,
                remote:config.ajaxUrls.userNameExistOrNot,
                maxlength:30
            },
            fullname:{
                required:true,
                maxlength:32
            },
            mobile:{
                required:true,
                number:true,
                maxlength:13
            },
            password:{
                required:true,
                rangelength:[6, 20]
            },
            confirmPwd:{
                equalTo:"#pwd"
            }
        },
        messages: {
            username:{
                required:config.ownInvalidMessage.required,
                remote:config.ownInvalidMessage.userNameExist,
                maxlength:config.ownInvalidMessage.maxlength.replace("${max}",30)
            },
            fullname:{
                required:config.ownInvalidMessage.required,
                number:config.ownInvalidMessage.number,
                maxlength:config.ownInvalidMessage.maxlength.replace("${max}",32)
            },
            mobile:{
                required:config.ownInvalidMessage.required,
                maxlength:config.ownInvalidMessage.maxlength.replace("${max}",20)
            },
            password:{
                required:config.ownInvalidMessage.required,
                rangelength:config.ownInvalidMessage.rangelength.replace("${min}",6).replace("${max}",20)
            },
            confirmPwd:{
                equalTo:config.ownInvalidMessage.equalTo
            }
        },
        submitHandler:function(form) {
            userCreate.formSubmit(form);
        }
    });

});
