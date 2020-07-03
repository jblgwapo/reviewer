$(document).ready(function(){
  bind();

  Local.init()



});



function checkDevice(){
  // Detects if device is in standalone mode
  const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  // Checks if should display install popup notification:
  if (isIos() && !isInStandaloneMode()) {
    console.log('Web');
    GUI_Alert('You can install the app for offline usage.<br><br><b>Step 1. </b>Click the share button.<br><b>Step 2. </b>Add to Home Screen.');
    //this.setState({ showInstallMessage: true });
  }
}



function bind(){
  //Boot up and start
  $('#bootScreen').animate({opacity:1}, 2500).animate({opacity:0}, 500, function(){ $('#bootScreen').attr('bootStatus','complete') });
  //--------------------
  //Setup tab navigation
  $('nav li').click(function(){
    //set target
    var target = $(this);
      //disable all buttons
      $('.tab').each(function(i){
        $(this).attr('active','false');
      });
      //close all
      $('section').each(function(i){
        $(this).attr('status','idle');
      });
      //enable target
      $($(target).attr('child')).attr('status','active');
      $(target).attr('active','true');
      var exec = $(target).attr('exec');
    });
    //on startup select main page
    $('nav li').get(0).click();

  //------------ Bind MCQ --------------------
  //Start
  $('[start]').click(function(){
    //Animate
    if(Bank.Token.length==0){
      Interface.alert('Please Select Subject First');
      return false;
    }
    Start()
      $('#mcqWindow').css('marginTop','7vh');
      $('#mcq').click().attr('status','active').animate({opacity:1 },100, function(){
        $('#mcqWindow').animate({top: '-1.7vh'},300).animate({top: '0.3vh'},150).animate({top: '0vh'},150, function(){
          $('#navigation_buttons').animate({opacity: '1'},250);
        });
      });

  })
  //Pause
  $('[pause]').click(function(){
    //Animate
    $('#navigation_buttons').animate({opacity: '0'},100, function(){
    $('#mcqWindow').animate({top: '-3vh'},100).animate({top: '100vh'},250, function(){
      $('#mcq').animate({opacity:0 },100, function(){ $('#mcq').attr('status','idle'); } );
    }); });
    Stop();
  })
  //Choices
  $('.userchoice').click(function(){
    var state = $('[choices]').attr('active');
    if(state=='true'){
      Choose(Number($(this).attr('index')));
    }else{
      alert('disabled')
    };
  });
  //Previous
  $('[previous]').click(function(){
    Previous();
  })
  //Next
  $('[next]').click(function(){
    Next();
  });
  //------------ Bind Settings --------------------
  //Toggles
  $('[setting]').click(function(){
    toggle = $(this).attr('toggle');
    state = $(this).is(':checked');
    console.log('state:'+state);
    Local.update.settings(toggle, state);
  });
  $('[contribute="join"]').click(function(){
    if(!Global.online) return;
    Interface.modal('#contribute');
  });
    //------------ User --------------------
    $('[user="login"]').click(function(){
      Global.login();
    });
    $('[contribute="register"]').click(function(){
      Local.userdata.token = $('[contribute="token"]').val();
      Local.update.userdata();
      location.reload();
    });


  //------------ GUI --------------------
  $('[terminate]').click(function(){
    Interface.terminate(`#${$(this).attr('terminate')}`);
  });

  //------------ Bind Modules (Bank) --------------------
  // Can be found on handler.js


}

//------------ Bind Keyboard -------------------------------------------------------------------
//document.addEventListener('keydown', id_return, false);

	function id_return(event) {
    if(System.idle) return;
		var x = event.keyCode;
    //console.log(x);
      switch (x) {
        case 13:
          Next();
          break;
        case 27:
          Pause();
          break;
        case 37:
          Previous();
          break;
        case 39:
          Next();
          break;
        case 49:
          choose(0);
          break;
        case 50:
          choose(1);
          break;
        case 51:
          choose(2);
          break;
        case 52:
          choose(3);
          break;
        default:
        return;
      }

    };


//-------------------------------------------------------------------------------
//GUI
Interface = {
  modal:function(modal){
    $(modal);
    $(modal).attr('status','active').animate({opacity:'1' },100,
    function(){ $(modal+'> div').animate({padding:'+=3pt', },200).animate({padding:'-=3pt' },100); });
  },
  alert:function(message){
    this.modal('#alert');
    $('#alertMessage').html('<p>'+message+'</p>');
  },
  dark:function(){
    mode = $('#darkmode').is(':checked');
    console.log(mode)
    if(mode){
      $('body').attr('dark', 'true');
    }
    else{
      $('body').attr('dark', 'auto');
    }
  },
  terminate:function(modal){
    target = $(modal);
    target.stop()
    target.animate({ opacity: 0}, "slow", function(){ $(modal).attr('status','idle'); });
    return;
        var opacity=100;
        var animation = setInterval(function(){
          target.css('opacity',opacity/100);
         opacity-=2;
         if(opacity==0){clearInterval(animation); target.attr('status','idle');}
       },2);
  },
  toggle:{
    admin:function(state){
      if(!Global.online){
        Local.userdata.admin = false;
        $('[admin="panel"]').attr('status','idle');
        $('[toggle="admin"]').prop('checked', false);
        return;
      }
      $('[admin="panel"]').attr('status',(state?'active':'idle'));
    },
    darkmode:function(state){
      $('body').attr('dark', (state?'true':'auto'));
    },
    statistics:function(state){

    },
    explanation:function(state){
      $('[explanation]').attr('status',(state?'active':'idle'));
    },
    links:function(state){
      $('[link]').attr('status',(state?'active':'idle'));
    },
    promodoro:function(state){
      //console.log('Promodoro:'+state);
    }
  },
  renderFeed:function(feeds){
    if(feeds.length==0) return;
    $('[user="feed"]').html('');
    feeds.map(feed=>{
      // user,  context, link, image
      html = `<span content="title-small"><b>${feed.user}</b></span><span content="text">${feed.context}</span>`;
      if(feed.image!='' || feed.image!=undefined){html+=`<img src="${feed.image}">`}
      if(feed.link!='' || feed.link!=undefined){ html+=`<a href="${feed.link}">${feed.link}</a>`}
      $('[user="feed"]').append(`<div class="container">${html}</div>`);
    });
  }

}
