$(document).ready(function(){

    $("#loginForm").validate({
        rules: {
            username: {
                required:true,
                maxlength:30
            },
            password:{
                required:true,
                rangelength:[6, 20]
            }
        },
        messages: {
            username: {
                required:config.ownInvalidMessage.required,
                maxlength:config.ownInvalidMessage.maxlength.replace("${max}",30)
            },
            password:{
                required:config.ownInvalidMessage.required,
                rangelength:config.ownInvalidMessage.rangelength.replace("${min}",6).replace("${max}",120)
            }
        }
    });
});