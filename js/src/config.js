/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-2-21
 * Time: 上午10:22
 * To change this template use File | Settings | File Templates.
 */
var config={
    urls:{
        userMgr:"s/user",
        packMgr:"s/bizPack"
    },
    ajaxUrls:{
        getAllUser:"s/user/list",
        getAllArea:"s/area/list",
        getAllOrder:"s/orderItem/list",
        getAllPack:"s/bizPack/list",
        getAllCharge:"s/",
        userNameExistOrNot:"s/user/uniqueUsername",
        deleteEmail:"s/notifyEmail/removeNotifyEmail",
        deleteUser:"s/user/remove",
        deleteArea:"s/area/remove",
        deletePack:"s/bizPack/remove",
        deleteOrder:"s/orderItem/remove",
        getAutoCompleteUser:"s/user/id2fullname",
        getAutoCompletePack:"s/bizPack/id2name"
    },
    perLoadCount:{
        table:10
    },
    order:{
        DES:"DES",
        ASC:"ASC"
    },
    message:{
        optSuccess:"操作成功！",
        inputEmailAndFullname:"请填写邮箱和姓名！",
        inputArea:"请输入区域！",
        networkError:"网络异常，请稍后重试！",
        systemError:"系统错误，请稍后重试或者联系开发人员！",
        optSuccRedirect:"操作成功,3秒后跳转到管理页！",
        timeout:"登录超时，3秒后自动跳到登陆页！",
        emailExist:"邮箱重复，请更换邮箱！",
        optError:"服务器端异常，请稍后重试！",
        oldPwdNotMatch:"原始密码不正确！"
    },
    ownInvalidMessage:{
        required:"此字段必填！",
        number:"只能输入数字和-！",
        digits:"请输入整数！",
        userNameExist:"用户名已经存在，请更换！",
        rangelength:"此字段为${min}-${max}个字符！",
        maxlength:"此字段最多为${max}个字符！",
        equalTo:"两次输入的密码不一致！",
        agree:"请同意本次大赛的协议！"
    },
    errorCode:{
        timeout:"timeout",
        account_active_email_email_duplicate:"account_active_email_email_duplicate",
        topic_profile_size_illegal:"topic_profile_size_illegal",
        account_password_not_match:"account_password_not_match"
    },
    ajaxErrorHandler:function(){
        this.hideBlackout();
        $().toastmessage("showErrorToast",config.message.networkError);
    },
    ajaxReturnErrorHandler:function(data){
        this.hideBlackout();

        var content=this.message.optError;
        var errorCode=data.errorCode;
        switch(errorCode){
            case config.errorCode.timeout:
                content=config.message.timeout;

                break;
            case config.errorCode.account_password_not_match:
                content=config.message.oldPwdNotMatch;

                break;
            case config.errorCode.account_active_email_email_duplicate:
                content=config.message.emailExist;

                break;
            default:
                content=config.message.systemError;
                break;
        }

        $().toastmessage("showErrorToast",content);
        if(errorCode==config.errorCode.timeout){
            this.redirect("s/login");
        }
    },
    initMenuStatus:function(url){
        if(url!==""){
            $("#menu a[href='"+url+"']").addClass("active");
        }
    },
    showBlackout:function(){
        $("#blackout").removeClass("hidden");
    },
    hideBlackout:function(){
        $("#blackout").addClass("hidden");
    },
    redirect:function(url){
        setTimeout(function(){
            window.location.href=$("#baseUrl").attr("href")+url;
        },3000);
    },
    setContentHeight:function(){
        if(document.body.scrollHeight<=$("body").height()){
            $(".content").css("minHeight",$("body").height()-190);
        }

    }
};

$(document).ready(function(){

    config.initMenuStatus(href);

    //config.setContentHeight();

    $(window).resize(function() {
        config.setContentHeight();
    });

    $("input[type='text'],input[type='email']").blur(function(){
        $(this).val($(this).val().trim());
    });
});

window.onload=function(){
    //考虑图片的加载

    config.setContentHeight();
};

