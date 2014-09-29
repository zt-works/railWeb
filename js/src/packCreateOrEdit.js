/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-5-21
 * Time: 上午9:12
 * To change this template use File | Settings | File Templates.
 */
var pack=(function(){
    return {
        formSubmit:function(form){
            config.showBlackout();
            $(form).ajaxSubmit({
                dataType:"json",
                success:function(data){
                    if(data.success){
                        //config.hideBlackout();
                        $().toastmessage("showSuccessToast",config.message.optSuccRedirect);
                        config.redirect(config.urls.packMgr);
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
    $("#packCreateForm").validate({
        rules:{
            name:{
                required:true,
                maxlength:30
            },
            price:{
                required:true,
                digits:true
            },
            bandwidth:{
                digits:true
            },
            duration:{
                required:true,
                digits:true
            },
            favorable:{
                maxlength:1000
            }
        },
        messages:{
            name:{
                required:config.ownInvalidMessage.required,
                maxlength:config.ownInvalidMessage.maxlength.replace("${max}",30)
            },
            price:{
                required:config.ownInvalidMessage.required,
                digits:config.ownInvalidMessage.digits
            },
            bandwidth:{
                digits:config.ownInvalidMessage.digits
            },
            duration:{
                required:config.ownInvalidMessage.required,
                digits:config.ownInvalidMessage.digits
            },
            favorable:{
                maxlength:config.ownInvalidMessage.maxlength.replace("${max}",1000)
            }
        },
        submitHandler:function(form) {
            pack.formSubmit(form);
        }
    });

});
