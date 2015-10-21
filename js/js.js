 //绑定回车键
$(function(){
    $(document).keydown(function(event){
        if(event.keyCode==13 && !$('textarea').is(event.target) && $('textarea').has(event.target).length ===0){
            $(".enterClick").click();
        }
    });

    $(".fancybox-effects-d").fancybox({
        padding: 0,
        openEffect : 'elastic',
        openSpeed  : 150,
        closeEffect : 'elastic',
        closeSpeed  : 150,
        closeClick : true,
        helpers : {
            overlay : null
        }
    });
 });

var cb_check = 'icon icon-check',
    cb_checked = 'icon icon-checked';
       
function checkSingle( evt ){
    if( evt.attr('class') == cb_check ){
        evt.attr('class',cb_checked);
    }
    else{
        evt.attr('class',cb_check);
    }
}

function checkAll( evt , tar ){
    if( evt.attr('class') == cb_check ){
        evt.attr('class',cb_checked);
        tar.attr('class',cb_checked);
    }
    else{
        evt.attr('class',cb_check);
        tar.attr('class',cb_check);
    }
}

