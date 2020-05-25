var Queue =[];
var Answers=[];
var System = {
    version:6.6,
    url:"https://script.google.com/macros/s/AKfycbwdlihHyUJEgrmUFHdtBixjHRWxSC-HgvuiyeSmUgDttm5XYR-X/exec",
    cache:[],
    activeFile:'',
  };

  var Subjects = {
    MATH:[
      "Algebra",
      "Geometry",
      "Trigonometry",
      "DiscreteMath",
      "Differential",
      "Integral",
      "DifferentialEquation",
      "AdvancedMath",
      "NumericalMethods",
      "ProbStat",
      "Extras"
    ],
    GEAS:[
      "Physics",
      "Thermodynamics",
      "Chemistry",
      "Economics",
      "Strength",
      "Mechanics",
      "Management",
      "Materials",
      "Vectors",
      "Laws",
      "Extras"
    ],
    ELEC:[
      "TestAndMeasurements",
      "MicroElec",
      "Computer",
      "PowerGenerator",
      "SolidStates",
      "ElectronicCircuit",
      "ElecMag",
      "Industrial",
      "Special",
      "Extras"
    ],
    EST:[
      "RadioWavePro",
      "Modulation",
      "Antennas",
      "DigiData",
      "TMAS",
      "Noise",
      "Microwave",
      "Optics",
      "SignalsSpectra",
      "Telephony",
      "Broadcasting",
      "Acoustics",
      "Extras"
    ],
  };


$(document).ready(function(){
  $('#contributor').val((localStorage.getItem('contributor') || 0) ? localStorage.getItem('contributor'): '');
  try {
    Queue = JSON.parse(localStorage.getItem('Queue'));


  } catch (e) {
    Queue=[];
    console.log('Queue failed');
    console.log(e);
  }



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
    $('#submit').click(function(){
      Submit();
    });
    $('#submit').click(function(){
      Reload();
    });
      $('li').get(0).click();

      Major = Object.keys(Subjects);
      options = '<option value="">Manual Mode</option>';
      for(i=0; i<Major.length; i++){
        options+='<optgroup label="'+Major[i]+'">';
        for(s=0;s<Subjects[Major[i]].length;s++){
          dir = Major[i] +'/'+Subjects[Major[i]][s];
          options += '<option value="'+dir+'">'+Subjects[Major[i]][s]+'</option>';
        }
        options+='</optgroup>'
      };
      $('#selectSub').html(options);



fileInit()

  });
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

var Submit = function(){
  console.log('Submit');
  var complete = true;
  var inc = [];
  ['major','subject','question','ans','c1','c2','c3','contributor'].map(function(foo){
      console.log(foo);
      if($(`#${foo}`).val().trim()==''){
        complete=false;
        inc.push(foo);
      }
  });
  if(!complete){
    GUI_Alert('Form is incomplete.<br><p>' + JSON.stringify(inc) +'</p>');
    return;
  }
  //check Choices
  var arr=[];
  ['ans','c1','c2','c3'].map(function(foo){
      arr.push($(`#${foo}`).val().trim());
  })
  var sorted_arr = arr.slice().sort();
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            //Duplicate
            GUI_Alert(`There's a duplicate in the choices.`);
            return;
        }
    }




  var token = {
    stamp:Date.now(),
    major:$('#major').val(),
    subject:$('#subject').val(),
    question:$('#question').val(),
    choices: `${$('#ans').val()}/jbl/${$('#c1').val()}/jbl/${$('#c2').val()}/jbl/${$('#c3').val()}`,
    image:$('#image').val(),
    explanation:$('#explanation').val(),
    links:$('#links').val().trim().replace('\n','/jbl/'),
    contributor:$('#contributor').val(),
  }
  //include either explanation or links
  if(token.links=='' && token.explanation==''){
    GUI_Alert('Provide links or atleast explain.');
    return;
  }

  console.log(token);
  //save to cache
  System.cache=[];
  ['question','ans','c1','c2','c3','image','explanation','links'].map(function(foo){
    System.cache.push(token[foo]);
  });
  upload(token);

};

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
var render = {};
function imagePreview(){
  clearTimeout(render);
  render = setTimeout(function(){
    var image = $(`#image`).val().trim();
    console.log(image);
    if(image==''){
      $('#imagePreview').attr('status','idle');
    }
    else{
      console.log('Image on form');
      $('#imagePreview').attr('status','active');
      $('#img').attr('src', image);
    }

  },500);

}

function fromQ(){
    if(Queue.length!=0){
      var token = Queue.pop();
      answer = null;
      if(token.hasOwnProperty('answer')){
        answer = token['answer'];
        console.log('Answer: ' +answer);
      }
      index = -1;
      ['question','ans','c1','c2','c3'].map(function(foo,i){

        $(`#${foo}`).val(token['form'][i]);
        if(token['form'][foo]==answer){
          console.log('Answer in: '+i-1);
        }
      });
      if(index!=-1){
        switchAns(index, "var(--green)");
        $('#note').html('')
      }
      else if (answer!=null) {
        $('#ans').css({color:"var(--red)"})
        $('#note').html(`Suggested: ${answer}`);
      }
      else{
        $('#ans').css({color:"var(--red)"})
        $('#note').html('')
      }



      $('#major').val(token.dir[0]);
      $('#subject').val(token.dir[1]);
    }


    $('.qcount').each( function(){
      $(this).html(Queue.length);
    });



}

function switchAns (num, color="inherit") {
  ans = $('#ans').val();
  sw = $(`#c${num}`).val();
  $('#ans').val(sw);
  $(`#c${num}`).val(ans);
  $('#ans').css({color:color})
}
function autosave(id){
  localStorage.setItem(id, $(`#${id}`).val());
}




var parse = function(){
  saveFile();
  Queue=[];
  que = [];
  item = [$('#selectSub option:selected').val(), $('#data').val(), $('#key').val()];

  //item 1 consists of questions
  //item 2 consists answers
  if(item[0]=="" || item[0]==null){
    major=$('#major').val().trim();
    subject = $('#subject').val().trim();
    if(major=='' || subject==''){
      GUI_Alert('Select Subject First');
      return;
    }
    item[0] = [major,subject];
  }
  else{
    item[0] = item[0].split('/');
    $('#major').val(item[0][0]);
    $('#subject').val(item[0][1]);
  }
  console.log(item[0]);
  major = item[0][0];
  subject = item[0][1];
  console.log('Item 0 :' + item[0]);
  //check if empty
  item[1]=item[1].trim();
  item[2]=item[2].trim();
  if(item[1]=='' || item[1]==null){
    GUI_Alert('Nothing to parse')
    return;
  }
  // Split lines
  Buffer = item[1].split('\n');
  for( i = 0; i < Buffer.length; i++){
    if ( Buffer[i] == '' || Buffer[i] == ' ' || Buffer[i]=='\t')
      {Buffer.splice(i, 1); i--;}};

  // Clean Question
  for(i=0; i<Buffer.length; i++){
    dot = Buffer[i].indexOf('.');
    if(dot <4){  Buffer[i] = Buffer[i].substr(dot+1).trim();}
    curve = Buffer[i].indexOf(')');
    if(curve <3){  Buffer[i] = Buffer[i].substr(curve+1).trim();}
  };

  console.log(Buffer.length/5);
  if(Buffer.length%5){ console.log('BufferLen: '+ Buffer.length);
  parseDebug();
  return;}
  //console.log(Buffer);
  len = (Buffer.length/5);
  for(i=0;i<len;i++){
    temp = Buffer.splice(0,5)
    que.push(temp);
  };
  console.log('Moving to answerkey');
  // answers
  if(item[2]!='' || item[2]!=' ' || item[2]!='\t'){
    answerKey=item[2].split('\n');
    for( var i = 0; i < answerKey.length; i++){
      if ( answerKey[i] == '' || answerKey[i] == ' ' || answerKey[i]=='\t')
        {answerKey.splice(i, 1); i--;}};
    //clean Answers
    for(i=0; i<answerKey.length; i++){
      dot = answerKey[i].indexOf('.');
      if(dot <4){  answerKey[i] = answerKey[i].substr(dot+1).trim();}
    };
    if(answerKey.length==que.length){GUI_Alert('Answer Key is recognized.');
      for(i=0;i<answerKey.length;i++){
        token = {
          form:que[i],
          answer:answerKey[i],
          dir:item[0]
        }
         Queue.push(token);
       }
    }
    else{
      GUI_Alert('Answer key not available.');
      console.log(answerKey.length+':')
      for(i=0;i<que.length;i++){
        token = {
          form:que[i],
          dir:item[0]
        }
         Queue.push(token);
       }
       console.log(Queue);
    };
  }
  console.log('Parse done!');
  console.log(Queue);
    $('.qcount').each( function(){
      $(this).html(que.length);
    });
    filename = $('#draftName').val();
    if(filename==null || filename==undefined){
      filename = `${Queue[0].dir[0]}-${Queue[0].dir[1]}`;
    }
    saveFile(filename);
  }

  var parseDebug = function(){
    item = [$('#subparse').val(), $('#data').val(), $('#key').val()]
    err=[];
    Buffer = item[1].split('\n');
    for(i=0; i<Buffer.length; i++){
      dot = Buffer[i].indexOf('.');
      if(dot <5){}
      else { err.push(i); } };
    if(err.length!=0){GUI_Alert('Parse Error. Check line(s) '+String(err)+'.' ); return;};

    // Remove whitespaces
    for( i = 0; i < Buffer.length; i++){
      if ( Buffer[i] == '' || Buffer[i] == ' ' || Buffer[i]=='\t')
        {Buffer.splice(i, 1); i--;}};

    expected = 'a.'
    for(i=0; i<Buffer.length; i++){
      if(i%5==0) continue;
      if(Buffer[i].toLowerCase().startsWith(expected)) {
        switch(expected){
          case 'a.': expected = 'b.'; break;
          case 'b.': expected = 'c.'; break;
          case 'c.': expected = 'd.'; break;
          case 'd.': expected = 'a.'; break;}
        }
        else{
          number = Math.floor(i/5)+1;
          GUI_Alert('Missing ' + expected + ' in item ' + number); return;}
      }


    GUI_Alert('Parse Error');



  }







  var upload = function(token){
    var url = System.url+'?action=push';
    try {
      GUI_activateModal('#upload');
      $.post(url, token, function (json) {
                console.log('Online!');
                console.log(JSON.stringify(json));
                if(json.hasOwnProperty('result')){
                  terminateModal('#upload');
                  if(json.result="success"){
                    GUI_Alert('Upload Complete!');
                    saveFile();
                    clearValues();

                    $('#ans').css({color:"inherit"})
                  }
                  else{
                    GUI_Alert('There was a Conflict!<br>'+json.result);
                    console.log(json);
                  };
                }
                else{
                  terminateModal('#upload');
                  GUI_Alert('Server Error');
                }
        },'json');


    } catch (e) {
      terminateModal('#upload');
      GUI_Alert('There was an error uploading the form.');
      console.log(e);
    }

};

function clearValues(){
  ['question','ans','c1','c2','c3','image','explanation','links'].map(function(foo){
    $(`#${foo}`).val('');
  });

}

function test(){
GUI_activateModal('#upload')
}

function fileInit(){
  try {
    drafts = localStorage.getItem('drafts');
    drafts = JSON.parse(drafts);
    var subjects = '';
    drafts.map(function(sub){
      subjects+=`<option value="${sub}">${sub}</option>`
    })
    $('#drafts').html(subjects);
    loadFile(drafts[0]);
  } catch (e) {
    GUI_Alert('There was an error loading the file<br>'+e);
  }
}


function saveFile(filename=''){
  if(filename=='') active = System.activeFile;
  else { active=filename }
    if(Queue.length==0)return;
    active = `${Queue[0].dir[0]}-${Queue[0].dir[1]}`;
    data = JSON.stringify(Queue);
    localStorage.setItem(active, data);
    console.log('Item has been Set');

  // save to drafts
  var drafts = localStorage.getItem('drafts');
  try {
    drafts = JSON.parse(drafts);
    drafts.length;
  } catch (e) {
    console.log('no saved drafts creating one');
    drafts = [];
  } finally {
    console.log(active);
    var exist = false;
    drafts.map(function(file){
      if(file==active) exist=true;
    });
    if(!exist) drafts.push(active);
    console.log(drafts);
    localStorage.setItem('drafts', JSON.stringify(drafts));
    console.log('File saved');
  }
  return;
  //end
}

function loadFile(filename=''){
  if(filename=='') filename = $('#drafts').val();
  if(filename=='') return;
  try {
    drafts = JSON.parse(localStorage.getItem('drafts'));
    drafts.map(function(file){
      if(file==filename){
        Queue = JSON.parse(localStorage.getItem(file));
        System.activeFile = file;
        console.log('File Loaded Successfully');
      }
    })
  } catch (e) {
    GUI_Alert('There was an error during access<br>'+e)
  }
  $('.qcount').each( function(){
    $(this).html(Queue.length);
  });
}
