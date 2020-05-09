$(document).ready(function(){

  $('li').click(function(){
    var target = $(this);
      $('.tab').each(function(i){
        $(this).attr('status','noSelect');
      });
      $('section').each(function(i){
        $(this).attr('status','idle');
      });
      $($(target).attr('child')).attr('status','active');
      $(target).attr('status','selected');
      var exec = $(target).attr('exec');
      switch (exec) {
        case 'none': return; break;
        case 'updateStats': updateStats(); return; break;
        case 'refreshBank': refreshBank(); return; break;
        default:
        return;
      }
    });

  $('li').get(0).click();
  $('#bootScreen').animate({opacity:1}, 2500).animate({opacity:0}, 500, function(){ $('#bootScreen').attr('bootStatus','complete') });

  const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test( userAgent );

}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
  console.log('Web');
  GUI_Alert('You can install the app for offline usage.<br><br><b>Step 1. </b>Click the share button.<br><b>Step 2. </b>Add to Home Screen.');
  //this.setState({ showInstallMessage: true });
}
console.log($('#server-id').val());
System.server = `https://script.google.com/macros/s/${$('#server-id').val()}/exec`;
Download();
//EST_BIX();
});




$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

var System = {
  server:'',
  startup:false,
  idle:true,
  onQuiz:false,
  answer:'Choice C',
  requireAnswer:false,
  activeSubjects:[],
  currentToken:'',
  History:[],
  historyIndex:0,
  imports:[],
  timeStamp:0,
  answered:0,
  averageTime:0,
  correct:0,
  Tomato:{
    session:0,
    rest:true,
    timer:3,
  }
}

var Bank = {
	MATH:{
		Algebra:[],
		Geometry:[],
		Trigonometry:[],
		DiscreteMath:[],
		Differential:[],
		Integral:[],
		DifferentialEquation:[],
		AdvancedMath:[],
		NumericalMethods:[],
		ProbStat:[],
	},
	GEAS:{
		Thermodynamics:[],
		Chemistry:[],
		Economics:[],
		Strength:[],
		Mechanics:[],
		Management:[],
		Materials:[],
		Vectors:[],
		Laws:[],
	},
	ELEC:{
		TestAndMeasurements:[],
		MicroElec:[],
		Computer:[],
		PowerGenerator:[],
		SolidStates:[],
		ElectronicCircuit:[],
		ElecMag:[],
		Industrial:[],
		Special:[],
		},
	EST:{
		RadioWavePro:[],
		Modulation:[],
		Antennas:[],
		DigiData:[],
		TMAS:[],
		Noise:[],
		Microwave:[],
		Optics:[],
		SignalsSpectra:[],
		Telephony:[]
	},
};

var Bank = {};

var random = { version:6.2,
	number: function (max, min=0){
		return Math.round(Math.random()*(+max - +min -1)) + +min;},
	array: function(size, max, min=0){
		array =[];
		for(i=0;i<size;i++)array.push(this.number(max,min));
		return array;},
	nonRepeatArray: function(size){
		array = []; for(i=0;i<size;i++)array.push(i);
		return this.shuffle(array);},
	choose: function(array){
		if(array.length==1) return array[0];
    return  array[this.number(array.length)];
		},
	shuffle: function(array){
		var currentIndex = array.length, temporaryValue, randomIndex;
  		while (0 !== currentIndex) {
    		randomIndex = Math.floor(Math.random() * currentIndex);
    		currentIndex -= 1;
   		temporaryValue = array[currentIndex];
    		array[currentIndex] = array[randomIndex];
    		array[randomIndex] = temporaryValue;
  			} return array;},
	token: function(){
			if(System.activeSubjects.length ==0){
				GUI_Alert('No Active Subjects');
        Pause();
        return null;
			}
			sub = this.choose(System.activeSubjects);
			dir = sub.split('/');
			if(Bank[dir[0]][dir[1]].length==0){
				GUI_Alert('Bank is empty.'); Pause(); return null;};
      var index = this.number(Bank[dir[0]][dir[1]].length)
      System.currentToken = (sub+'/'+index);
      return Bank[dir[0]][dir[1]][index];
			//console.log('token: ' + JSON.stringify(token));
		},
};

function GUI_activateModal(modal){
  $(modal);

  $(modal).attr('status','active').animate({opacity:'1' },100, function(){ $(modal+'> div').animate({padding:'+=3pt', },200).animate({padding:'-=3pt' },100); });

};
function GUI_Alert(message){
  GUI_activateModal('#alert');
  $('#alertMessage').html('<p>'+message+'</p>');
}

function GUI_dark(){
  mode = $('#darkmode').is(':checked');
  console.log(mode)
  if(mode){
    $('body').attr('dark', 'true');
  }
  else{
    $('body').attr('dark', 'auto');
  }
}

function terminateModal(modal){
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
};

function debug(asd){
  console.log(asd);
};

function updateStats(){
  $('#userStats').html('Avg Time: '+ System.averageTime + '<br>Answered: ' +System.answered + '<br>Correct: '+ System.correct );
}

function refreshBank(){
  var major = Object.keys(Bank);
  var subject = [];
  var tokenCount=0;
  for(var i=0;i<major.length;i++){
    subject.push(Object.keys(Bank[major[i]]));}
  content='';
  /*content+='<tr><th class="subject">Subject</th><th class="count">Count</th><th class="check">Status</th></tr>'; */
  for(m=0;m<major.length;m++){
    content+= '<span content="title">'+major[m]+'</span><div class="container"><table>';
    for(s=0;s<subject[m].length;s++){
      dir = major[m]+'/'+subject[m][s];
      check = System.activeSubjects.indexOf(dir);
      tokenCount+=Bank[major[m]][subject[m][s]].length;
      if(check>=0 && Bank[major[m]][subject[m][s]].length) check='checked';
      else check='';
      content+='<tr>';
      content+='<td class="toggle-label">'+subject[m][s]+'</td>';
      content+='<td class="count alignRight" > '+ String(Bank[major[m]][subject[m][s]].length)+'</td>';
      content+='<td class="toggle alignRight"><label class="switch"><input type="checkbox" '+
        check+' value="'+dir+'" name="selectSub" onclick="toggleSubject(event)"><span class="slider round"></span></label></td>';
      content+='</tr>';}

    content+='</table></div>';}
  //content+='</table>';
  $('#questionBank').html(content);
  $('#questionBankStats').html('Question count:<br><span content="emphasize">'+ tokenCount +'</span>')
}

////--------------------------GOOGLE DRIVE ------
function Download(){
  var url = `${System.server}?action=pull`;
  var saved = localStorage.getItem('Bank');
  var hasData = false;
  if (saved!=null){
    try {
      saved = JSON.parse(saved);
      console.log('We have local data...');
    } catch (e) { }
  }
  $.getJSON(url, function (json) {
    console.log(json);
    console.log(JSON.stringify(json));
            parseData(json.data);
            localStorage.setItem('Bank', JSON.stringify(json.data))
            console.log('Question Bank has been Updated');

    }).fail(function(){
        try {
          parseData(saved);
          GUI_Alert('Offline data has been loaded.');
        } catch (e) {
            console.log(e);
            console.log(JSON.stringify(saved));
            GUI_Alert('Cannot Connect to Server.')
        }
      });
return;
}




//////////////
function parseData(data){
  data.map( function(token){
    if(typeof(token)!='object') {
      console.log('Not a token: ' + typeof(token));
      return;
    }
    var contents = Object.keys(token);
    var verified = true;
    ['stamp','major','subject','question','choices','image','links','explanation','contributor'].map(required=>{
      if(!contents.includes(required)){
        console.log('Missing '+ required);
        verified=false; };
    });
    if(verified==false){
      console.log('Token is not complete.');
      return;
    }
    console.log('Token Accepted');
    appendBank(token);
  });
  refreshBank();
}


function appendBank(token){
  //debug(token.question);
  if(token.question==null) { console.error('token error: no // QUESTION: ');
  console.log(token);
  return;}
  if(Bank.hasOwnProperty(token.major)){
    if(Bank[token.major].hasOwnProperty(token.subject)){ Bank[token.major][token.subject].push(token);}
    else{Bank[token.major][token.subject] = [token];
      System.activeSubjects.push(`${token.major}/${token.subject}`);
    }
  }
  else{
    Bank[token.major]={};
    Bank[token.major][token.subject]=[token];
    System.activeSubjects.push(`${token.major}/${token.subject}`);
    console.log('New Subject');
  }
};

function Import(dependency){
  if (dependency=='' || dependency==null) { console.error('Dependency is Empty'); return;}
  var cache = eval(dependency);
  dependency='';
  console.log(cache.length);
  if (cache.length==0) { console.log('Dependency Fail Err:' + dependency);}
  for(i=0; i<cache.length; i++){
    appendBank(cache[i]);
  }
  refreshBank();
};


function loadDependency(){
    //some scripts here
    var request = $('#cli').val();
    var dependencies = request.split('\n');
    for(i=0;i<dependencies.length;i++)
	    if (dependencies[i]== ''|| dependencies[i]==' ' || dependencies[i]=='\t' || System.imports.includes(dependencies[i])){
	      dependencies.splice(i, 1);
	      i--;}
        var localStorage;
      for(i=0;i<dependencies.length;i++){
        dependencies[i]=dependencies[i].trim();
        console.log(dependencies[i]);
        System.imports.push(dependencies[i]);
        dependencies[i] = '<script src="resources/database/TARGET.js" async></script>'.replace('TARGET', dependencies[i]);
        localStorage+=dependencies[i];
      };
      $('#localStorage').append(localStorage);
      refreshBank();
};



// main

function Start(){
  if(System.activeSubjects.length==0) {GUI_Alert('Please select subjets at the Question Bank'); return;}
  if(System.Tomato.rest){
    GUI_activateModal('#tomato');
    return;
  }
  System.idle=false;
  $('#mcqWindow').css('marginTop','7vh');
  $('#mcq').click().attr('status','active').animate({opacity:1 },100, function(){
    $('#mcqWindow').animate({top: '-1.7vh'},300).animate({top: '0.3vh'},150).animate({top: '0vh'},150, function(){
      $('#navigation_buttons').animate({opacity: '1'},250);
    });
  });
  if(!System.startup){ Load(random.token()); System.startup=true; System.idle=false; }
  System.timeStamp=Date.now();
};

function Pause(){
  System.idle=true;
  $('#navigation_buttons').animate({opacity: '0'},100, function(){
  $('#mcqWindow').animate({top: '-3vh'},100).animate({top: '100vh'},250, function(){
    $('#mcq').animate({opacity:0 },100, function(){ $('#mcq').attr('status','idle'); } );
  });
});

}
function Previous(){
  console.log(System.historyIndex);
  if(System.historyIndex==0) { System.historyIndex=0; return;}
  else if(System.requireAnswer==true){
    var choices = [];
    $('.choice').each(function(){ choices.push($(this).text());});
    System.History.push([System.currentToken, choices]);
    System.requireAnswer=false;
  }

  System.historyIndex--;
  Preview(System.historyIndex);

};


function Next(){
  if(System.activeSubjects.length==0) {GUI_Alert('Please select subjets at the Question Bank'); Pause(); return;}
  System.timeStamp=Date.now();
  if(System.requireAnswer)return;
  System.historyIndex++;
  //if(System.historyIndex<System.History.length){  }
  if(System.historyIndex==System.History.length){
    Load(random.token()); return;}
  else{
  Preview(System.historyIndex);}

}


function Preview(index){
  console.log('Preview: '+System.historyIndex+'/'+System.History.length);
  var cache = System.History[index];
  var dir = cache[0].split('/');

  var token = Bank[dir[0]][dir[1]][Number(dir[2])];
  System.answer = token.choices.split('/jbl/')[0];;
  $('#question').text(token.question);
  choices = cache[1];

  if(token.image=='none' || token.image==null){
    $('#mcqimage').attr('status','idle');
    console.log(token.image);
  }
  else{
    console.log('img');
    $('#mcqimage').attr('status','active');
    $('#mcqimage').attr('src',token.image);
    console.log(token.image);
  }

  var i=0;
  $('.choice').each(function(){ $(this).attr('remarks','locked'); $(this).text(choices[i]); i++});
  $('#major').text(token.major);
  $('#explanation').text(token.explanation);
  $('#links').text(token.links);
  if(cache.length==2){
    $('.choice').each(function(){ $(this).attr('remarks','none');});
    System.History.pop(); System.requireAnswer=true; return; }
  var attempt = cache[2];
  $('.choice').each(function(){
    if($(this).text()==System.answer){$(this).attr('remarks','correct'); return; }
    if($(this).text()==attempt){$(this).attr('remarks','wrong'); return;}
    $(this).attr('remarks','locked');
  });

};


function Load(token){
  if(token==null) { token=random.token(); }
  if(token==null) { Pause(); GUI_Alert('Token Failed');}
  //console.log('Load: '+System.historyIndex+'/'+System.History.length);
  $('#frame').animate({scrollTop:0},500);
  //.scrollTop(0);
  $('#question').text(token.question);
  var choices = token.choices.split('/jbl/');
  $('#token-id').val(token.stamp);
  System.answer = choices[0];
  //var choices = token.choices.concat(token.answer);
  var i=0;
  choices = random.shuffle(choices);
  console.log(choices);
  $('.choice').each(function(){ $(this).attr('remarks','ready'); $(this).text(choices[i]); i++});
  System.requireAnswer=true;
  a = '';
  if(token.links){
    for(i=0;i<token.links.length;i++){
    a+='<a href="'+token.links[i]+'">Link '+String(i+1)+'</a><br>';}
  }
  if(token.image=='none' || token.image==null || token.image==''){
    $('#hasimage').attr('status','idle');
    console.log('No image');
  }
  else{
    console.log('img');
    $('#hasimage').attr('status','active');
    $('#mcqimage').attr('src',token.image);
    console.log(token.image);
  }

  $('#explanationContainer').attr('status','idle');
  $('#linksContainer').attr('status','idle');
  $('#major').text(token.major);
  $('#explanation').html(token.explanation);
  $('#links').html(token.links);
}

function choose(index){
  var userTime = Date.now()-System.timeStamp;
  console.log('time:'+userTime);

  System.averageTime= ((System.averageTime*System.answered)+ userTime)/(System.answered+1);
  System.answered++;
  console.log('avg: '+ System.averageTime);
  if(System.requireAnswer!=true) return;
  attempt=$('.choice').get(index).innerHTML;
  var choices = [];
  $('.choice').each(function(){
    choices.push($(this).text());
    if($(this).text()==System.answer){$(this).attr('remarks','correct'); return; }
    if($(this).text()==attempt){$(this).attr('remarks','wrong'); return;}
    $(this).attr('remarks','locked');
  });
  if(attempt==System.answer){ System.correct++;}
  System.History.push([System.currentToken,choices,attempt]);
System.requireAnswer=false;

 if($('#showexp').is(':checked')){
   $('#explanationContainer').attr('status','active');

 }
 if($('#showlinks').is(':checked')){
   $('#linksContainer').attr('status','active');
 }


};

function toggleSubject(event){
//event.preventDefault();
    var Subs = $('input[name="selectSub"]:checked').map(function(){
      return $(this).val();
    }).get();
    Subjects = []
    for(i=0; i<Subs.length;i++){
      var dir = Subs[i].split('/');
      if(Bank[dir[0]][dir[1]].length || 0) Subjects.push(Subs[i]);
    }
    System.activeSubjects = Subjects;
    //console.log(Subjects);
};

function Promodoro(){


}



document.addEventListener('keydown', id_return, false);

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


var Clock = setInterval(function(){
  if(System.Tomato.rest){
    System.Tomato.timer--;
    var min = parseInt(System.Tomato.timer/60);
    var sec = System.Tomato.timer%60;
    var t = (min<10? '0' : '')+String(min)+':' + (sec<10? '0' : '')+String(sec);
    $('#tomato-timer').html( t);


    if(System.Tomato.timer<=0){
      System.Tomato.rest=false;
      System.Tomato.timer=0;
    }
    return;
  }
  else if (System.idle==false) {
    System.Tomato.timer++;
    if(System.Tomato.timer>1500){
      System.Tomato.rest=true;
      Pause();
      if(System.Tomato.session%4){
        System.Tomato.timer=900;
      }
      else{
        System.Tomato.timer=300;
      }

    }
  }

}, 1000);
