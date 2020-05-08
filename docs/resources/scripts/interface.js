$(document).ready(function(){
  var screenHeight = window.screen.height;
  var screenWidth = window.screen.width;
  var zoom =  window.devicePixelRatio;
  var reference = screenWidth;
  if(screenHeight < screenWidth) reference = screenHeight;
  //$('.tab_icon').css("max-height", reference/20+'px');
  var reference = (Math.floor(zoom*(reference*0.05)));
  console.log(reference);
  if(reference>(screenHeight*.04)){ reference=0.05*screenHeight;}
  //$("body").css({fontSize: reference});
  calibrateNavBar();
  log(zoom);

  $('#height').html(screenHeight);
  $('#width').html(screenWidth);
  $('#zoom').html(zoom);
  $('#ratio').html(screenWidth/screenHeight);
  $('#orrientation').html( ($(window).width() > $(window).height()? 'Landscape' : 'Portrait'));
  $('#fontSize').html(reference);


    $('.tab_element').click(function(){
      selected=$(this);
      $('.tab_element').each(function(i){
        $(this).attr('active','false');
      });
      $('.container').each(function(i){
        $(this).attr('active','false');
      });
      $('.'+selected.attr('show')).attr('active','true');
      selected.attr('active','true');
    });

    $('.home').click();

  });

window.onresize = function(){calibrateNavBar();};

function calibrateNavBar(){
  if($(window).width() > $(window).height()){
    $('.tab_icon').css({display: 'inline-block'});
  }
  else{
    $('.tab_icon').css({display: 'block'});
  }
};

//Nav Bar
