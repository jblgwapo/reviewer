$(document).ready(function(){

  $('li').click(function(){

    target = $(this).attr('tab');
    //if(Interface.tab==index){ console.log('retuned'); return;}
    //offset=$('.tab').eq(0).offset().left;
    //if(index!=0 && offset==0) return;

    var offset = Number($(target).eq(index).offset().left);
    off=offset;

    //$('main').stop().animate({scrollLeft: offset },1000);
    $('main').stop(true).animate({scrollLeft: offset },500, function(){

      //$('main').stop().animate({scrollLeft: off },1000);

    //});

      });
    });
  });
