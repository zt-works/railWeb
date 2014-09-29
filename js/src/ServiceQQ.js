document.write("<div class='QQbox' id='divQQbox' >");

document.write("<div class='Qlist' id='divOnline' onmouseout='hideMsgBox(event);' style='display : none;'>");

document.write("<div class='t'></div>");

document.write("<div class='con'>");

document.write("<h2>在线客服</h2>");

document.write("<ul>");
//Uin代表QQ号码,在获取头像那里，src='http://wpa.qq.com/pa?p=1:707064895:4' 后面的:4是代表不同类型的图标，从1-16都可以
document.write("<li class=odd><a href='http://wpa.qq.com/msgrd?V=1&amp;Uin=1551131466&amp;Site=长沙铁通--开福欢迎您&amp;Menu=yes'"+
    "target='_blank'><img src='http://wpa.qq.com/pa?p=1:1551131466:4'  border='0' alt='QQ' />客服1</a></li>");

document.write("<li><a href='http://wpa.qq.com/msgrd?V=1&amp;Uin=1551131466&amp;Site=长沙铁通--开福欢迎您&amp;Menu=yes' "+
    "target='_blank'><img src='http://wpa.qq.com/pa?p=1:1551131466:4'  border='0' alt='QQ' />客服2</a></li>");

//document.write('<tr><td><li><a target="_blank" href="http://amos.im.alisoft.com/msg.aw?v=2&uid=szmaimaiba&site=cntaobao&s=1&charset=utf-8" ><img border="0" src="http://amos.im.alisoft.com/online.aw?v=2&uid=szmaimaiba&site=cntaobao&s=1&charset=utf-8" alt="湖南中恩欢迎您" /></a></li></td></tr>');

//document.write('<tr><td><li><a target="_blank" href="http://amos.im.alisoft.com/msg.aw?v=2&uid=%E8%88%9E%E8%B9%88%E7%94%A8%E5%93%81%E6%89%B9%E5%8F%91%E5%BA%97&site=cntaobao&s=1&charset=utf-8" ><img border="0" src="http://amos.im.alisoft.com/online.aw?v=2&uid=%E8%88%9E%E8%B9%88%E7%94%A8%E5%93%81%E6%89%B9%E5%8F%91%E5%BA%97&site=cntaobao&s=1&charset=utf-8" alt="湖南中恩欢迎您" /></a></li></td></tr>');

document.write("</ul>");
document.write("</div>");

document.write("<div class='b'><img src='images/qq/phone.png'>0731-85787977</div>");

document.write("</div>");

document.write("<div id='divMenu' onmouseover='OnlineOver();'><img src='images/qq/qq_1.png' class='press' alt='QQ客服热线'></div>");

document.write("</div>");

function OnlineOver() {
    document.getElementById("divMenu").style.display = "none";
    document.getElementById("divOnline").style.display = "block";
    document.getElementById("divQQbox").style.width = "145px";
}

function OnlineOut() {
    document.getElementById("divMenu").style.display = "block";
    document.getElementById("divOnline").style.display = "none";
}

function hideMsgBox(theEvent){
    var browser=navigator.userAgent;
    if(theEvent){
        //当鼠标mouseout的时候，鼠标移动到目标的子元素上也会认为鼠标移开了目标元素
        //判断是否鼠标移动的时候，是否是在divOnline的子元素上面移动，如果是的就不需要隐藏即终止这个操作（函数），用return跳出下面的语句
        //判断是否在子元素移动，其实就是看移动时候的事件对象是否被divOnline包含
        if (browser.indexOf("Firefox") >= 0) {
            //火狐下检测是否有子元素
            if(document.getElementById('divOnline').contains(theEvent.relatedTarget)){
                return;
            }
        }else{
            if(document.getElementById('divOnline').contains(theEvent.toElement)){
                return;
            }
        }
    if(browser.indexOf("MSIE")>=0){
                //ie下检测是否有子元素
                if(document.getElementById('divOnline').contains(theEvent.toElement)){
                    return;
                }
            }


        }
    //要执行的操作

    OnlineOut();
}
