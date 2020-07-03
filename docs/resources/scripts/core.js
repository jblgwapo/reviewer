System = {
  latest:'',



}


function Start(){
  //check if active
  //load which is logical
  //

  Load()

}
function  Stop(){



}

function Load(token=Bank.getToken()){
  //Token format:['stamp', 'question','choices','image','links','explanation','contributor']
  token = JSON.parse(JSON.stringify(token));
  //put everything together
  console.log('Load');
  console.log(token);
  $('[stamp]').val(token.stamp);
  $('[question]').text(token.question);
  $('[link]').html('<!-- Read More -->');
  if(token.links!= '' )
  token.links.split('[~]').map(l=>{$('[link]').append(`<a href="${l}" >Read More...</a><br>`)});
  $('[contributor]').text(token.contributor);
  if(!token.image.trim()==''){
    $('[mcqimageholder]').attr('status','active');
    $('[mcqimage]').attr('src',token.image);
  }
  else{
    $('[mcqimageholder]').attr('status','idle');
  }
  $('[explanation]').text(token.explanation);




  //check if token is answered
  if(!token.hasOwnProperty('log')){
    log = random.nonRepeatArray(4);
    token['log'] = log;
    Local.update.history(token);
  }
  //get answer and attempt
  answered=false; attempt=0;
  //answered
  if(token.log.length==5){
    answered=true;
    attempt = token.log[4]
    $('div[choices]').attr('active','false');
    console.log(token.log.length);
  }
  //not answered
  else if(token.log.length==4){
    console.log('choices are now active');
    $('div[choices]').attr('active','true');
  };

  choices = token.choices.split('[~]')
  //itterate
  $('[choice]').each(function(i){
    $(this).attr('remarks','none');
    $(this).text(choices[token.log[i]]);
    //if answered
    if(answered && token.log[i]==0){ $(this).attr('remarks','correct');}
    else if(answered && attempt==i){ $(this).attr('remarks','wrong'); }
    else{ $(this).attr('remarks','idle'); }
  });
  $('[mcqinfo]').attr('status','idle');
  console.log(Local.history.array);
  m = Local.history.index+'logs: '
  Local.history.array.map(v=>{
    m+=v.log.length;
  });
  console.log(m);
}

function Choose(index){
  if ($('div[choices]').attr('active')=='false') {
    return;
  }

  if(Local.history.index!=0)return;
  $('div[choices]').attr('active','false');
  token = Local.history.array[0]
  console.log(token);
  console.log('You choose: '+index);
  Local.history.array[0].log.push(index);
  correct = false;
  $('[choice]').each(function(i) {
    if(index==i && token.log[i]!=0){$(this).attr('remarks','wrong')}
    if(index==i && token.log[i]==0){ correct=true;}
    if(token.log[i]==0){$(this).attr('remarks','correct')}
  });
  //Add stats
  Local.update.statistics(correct);
  $('[mcqinfo]').attr('status','active');
  //asses
  //color the buttons
  //update history
  //enable navigation - next previous
}

function Previous(){
  // check history index
  //load
  console.log('h index: '+Local.history.index);
  console.log('history: '+Local.history.array);
  $('div[choices]').attr('active','false');
  if(Local.history.array.length==(Local.history.index+1)){
    return;
  }
  else{
    Local.history.index+=1;
    Load(Local.history.array[Local.history.index])
  }

}



function  Next(){
  //check history index
  //load
  console.log('h index: '+Local.history);
  if(Local.history.index==0){
    if($('div[choices]').attr('active')=='true'){
      console.log('no answer yet');
      return;
    }
    if(Bank.Token.length==0){
      console.log('No token');
      return
    }
    $('div[choices]').attr('choices','false');
    Load(random.choose(Bank.Token));
    return;
  }
  else{
    Local.history.index-=1;
    $('div[choices]').attr('active','false');
    Load(Local.history.array[Local.history.index])
  }
}



Contributor = {
  init:function(){
    subject = Object.keys(Local.bank.subject)
    major = Object.keys(Local.bank.major)
    console.log(major );
    console.log(subject);



    $('[admin="verify"]').click(function(){
      Contributor.Verify();
    })
    $('[admin="load"]').click(function(){
      Contributor.Load();
    })
    $('[admin="parse"]').click(function(){
      Contributor.Parse();
    })

    $('[admin="switch"]').each(function(){
      $(this).click(function(){
        Contributor.Switch(Number($(this).attr('index')));
      });
    })

//More controls ----------------------------------------------------------------
    $('[admin="upload"]').click(function(){
      Contributor.Upload();
    });
    $('[admin="add"]').click(function(){
      Contributor.Add();
    });
    $('[admin="remove"]').click(function(){
      Contributor.Remove();
    });

    $('[admin="search"]').click(function(){

    });
//Pro controls ----------------------------------------------------------------
$('[admin="fetch"]').click(function(){
  Global.fetch();
});
$('[admin="dver"]').click(function(){
  Contributor.Queue.verified = [];
  $('[admin="verified"]').html(``);
  Local.update.queue();
});
$('[admin="dque"]').click(function(){
  Contributor.Queue.unverified = [];
  Contributor.Count();
  Local.update.queue();
});

//GUI controls ----------------------------------------------------------------

    $('[show]').click(function(){
      target = $(this).attr('show')
      if($(this).is(':checked')){
        $(`[contribute="${target}"]`).css({height:'auto', },200);
      }
      else {
        $(`[contribute="${target}"]`).css({height:0, },200);
      }
    })
    $('[show]').each(function(i){
      target = $(this).attr('show');
      height = $(`[contribute="${target}"]`).height();
      $(this).attr('h',height);
      $(`[contribute="${target}"]`).css({height:0, },200);
    })

    Local.get('savedata')
    Contributor.Count();

  },

  Parse: function(){
    Queue=[];
    que = [];
    item = [$('[admin="module"] option:selected').val(), $('[admin="parsequestion"]').val().trim(), $('[admin="parseanswer"]').val().trim()];

    //item 1 consists of questions
    //item 2 consists answers
    if(item[0]=='default'){
      Interface.alert('Please Select Subject First');
      return;
    }

    if(item[1]=='' || item[1]==null){
      Interface.alert('Nothing to parse')
      return;
    }
    if(item[2]=='' || item[2]==null){
      ans = confirm('Answer key is missing. Are you sure you want to continue?')
      if(!ans){ return; }
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
    Contributor.Debug();
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
        answerKey[i].trim();
        if ( answerKey[i] == '' || answerKey[i] == ' ' || answerKey[i]=='\t')
          {answerKey.splice(i, 1); i--;}};
      //clean Answers
      for(i=0; i<answerKey.length; i++){
        dot = answerKey[i].indexOf('.');
        if(dot <4){  answerKey[i] = answerKey[i].substr(dot+1).trim();}
      };
      if(answerKey.length==que.length){

        for(i=0;i<answerKey.length;i++){
          token = {
            form:que[i],
            answer:answerKey[i],
            path:item[0]
          }
           Queue.push(token);
         }
         Interface.alert('Done Parsing');
      }
      else{
        ans = confirm(`Answer key not recognized: Questions(${que.length}) Answers(${answerKey.length}): Would you like to proceed?`);
        if(!ans){ return; }
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
    Contributor.Queue.unverified = Contributor.Queue.unverified.concat(Queue);
    //clear
    $('[admin="module"]').val('default');
    $('[admin="parsequestion"]').val('');
    $('[admin="parseanswer"]').val('');
    //update local
    Local.update.queue();
    Contributor.Count();
  },
  Debug:function(){
    item = [$('[admin="module"]').val(), $('[admin="parsequestion"]').val().trim(), $('[admin="parseanswer"]').val().trim()]
    err=[];
    Buffer = item[1].split('\n');
    for(i=0; i<Buffer.length; i++){
      dot = Buffer[i].indexOf('.');
      if(dot <5){}
      else { err.push(i); } };
    if(err.length!=0){Interface.alert('Parse Error. Check line(s) '+String(err)+'.<br><b style="color:var(--red)">'+ Buffer[i]+'</b>' ); return;};

    // Remove whitespaces
    for( i = 0; i < Buffer.length; i++){
      if ( Buffer[i] == '' || Buffer[i] == ' ' || Buffer[i]=='\t')
        {Buffer.splice(i, 1); i--;}};

    expected = 'a.'
    for(i=0; i<Buffer.length; i++){
      if(i%5==0) continue;
      if(Buffer[i].toLowerCase().trim().startsWith(expected)) {
        switch(expected){
          case 'a.': expected = 'b.'; break;
          case 'b.': expected = 'c.'; break;
          case 'c.': expected = 'd.'; break;
          case 'd.': expected = 'a.'; break;}
        }
        else{
          number = Math.floor(i/5)+1;
          Interface.alert('Missing ' + expected + ' in question ' + number + '. <br><b style="color:var(--red)">'+ Buffer[i]+'</b>'); return;}
      }


    Interface.alert('Parse Error');


  },
  Verify: function(){
    path = $('[admin="path"] option:selected').val();
    if(path=='default'){
      Interface.alert('Select Subject');
      return;
    }
    question = $('[admin="question"]').val();
    answer = $('[admin="answer"]').val();
    a = $('[admin="c1"]').val();
    b = $('[admin="c2"]').val();
    c = $('[admin="c3"]').val();

    var complete = true;
    var illegal = false;
    [path,question,answer,a,b,c].map(val=>{
      val = val.trim();
      if(val==''){ complete=false;}
      if(val.includes('[~]')){ illegal=true; }
    });
    if (illegal) {
      Interface.alert('Illegal characters ( [~] )');
      return;
    }
    if(!complete){
      Interface.alert('Form is  incomplete.');
      return;
    }



    image = $('[admin="image"]').val().trim();
    explanation = $('[admin="explanation"]').val().trim();
    links = $('[admin="links"]').val().trim().replace('\n','[~]');



    //verified
    token = {
      path:path,
      question:question,
      choices:`${answer}[~]${a}[~]${b}[~]${c}`,
      explanation:explanation,
      image:image,
      links:links,
      contributor:Local.userdata.username
    }
    question = $('[admin="question"]').val('');
    answer = $('[admin="answer"]').val('');
    a = $('[admin="c1"]').val('');
    b = $('[admin="c2"]').val('');
    c = $('[admin="c3"]').val('');

    image = $('[admin="image"]').val('');
    explanation = $('[admin="explanation"]').val('');
    links = $('[admin="links"]').val('');
    this.Queue.verified.push(token);
    Local.update.queue();

    auto = $('[admin="auto"]').is(':checked')
    if(auto){
      Contributor.Load();
    }

      Contributor.Count();

  },
  Switch:function(index, color="inherit"){
    if(index==0){ $('[admin="answer"]').css({color:color});
    return;}
    if(index>3){console.log('Invalid Switch: ' + index); return}
    ans = $('[admin="answer"]').val();
    sw = $(`[admin="c${index}"]`).val();
    $('[admin="answer"]').val(sw);
    $(`[admin="c${index}"]`).val(ans);
    $('[admin="answer"]').css({color:color})
  },
  connection:{
    uploading:false,
    streak:0,
    error:0,
  },
  Upload: function(){
    if (this.connection.error==3) {
      this.connection.uploading=false;
      this.connection.streak=0;
      this.connection.error=0;
      Interface.alert('Upload has Stopped<br>Error:'+Contributor.connection.log)
      Contributor.Count();
      $('[admin="upload"]').css({background:'var(--button)'});
      return;
    }

    if(this.connection.uploading){
      Interface.alert('Already uploading');
      return;
    }
    if(Contributor.Queue.verified.length==0 || 0){
        Interface.alert('Nothing to upload');
        return;
      }
    if(this.connection.streak==0){
      $('[admin="verified"]').html(`ing...`);
    }

    $('[admin="upload"]').css({background:'var(--diff)'});
    console.log('upLoading...');
    this.connection.uploading = true;

    form = Contributor.Queue.verified[0];
    form['stamp'] = Date.now();
    form['token'] = Global.token;
    console.log(form);
    $.ajax({ type: "POST", url: Global.parse(Local.settings.server, 'token'),
    data:form, timeout: 10000,

      error: function(jqXHR, textStatus, errorThrown) {
        Contributor.connection.error++;
          if(textStatus==="timeout") {
            console.log(jqXHR);
            console.log(errorThrown);
            console.log('timeout. retrying......');
            Contributor.connection.uploading=false;
            Contributor.Upload();
            return;
          }
          Contributor.connection.log = textStatus
          console.log('Upload has Stopped<br>Error:'+textStatus)
          console.log(errorThrown);
          Contributor.connection.uploading=false;
          Contributor.connection.streak=0;
          console.log('timeout. retrying......');
          Contributor.connection.uploading=false;
          Contributor.Upload();
      },//error
      success:function(result){
        result = JSON.parse(result);
        if(!result.success){
          console.log(result);
          Contributor.connection.error++;
          Contributor.connection.log = result.message
          Contributor.Upload();
          return;
        }
        Contributor.connection.error=0;
        Contributor.connection.streak++;
        Contributor.connection.uploading=false;
        Contributor.Queue.verified.shift();
        //progress
        progress = 100*(Contributor.connection.streak/(Contributor.Queue.verified.length+Contributor.connection.streak));
        //console.log(`Uploading: ${Contributor.connection.streak} of ${Contributor.Queue.verified.length+Contributor.connection.streak} ${progress.toFixed(2)}%`);
        //reupload
        Local.update.queue();
        $('[admin="verified"]').html(`ing... (${progress.toFixed(2)}%) `);
        if(Contributor.Queue.verified.length!=0){
          Contributor.connection.uploading=false;
          Contributor.Upload();
          return;
      }
      Contributor.connection.streak=0;
      Contributor.Count();
      $('[admin="upload"]').css({background:'var(--button)'});
      Global.fetch();
    }//success
  });//End Post

  },
  Add:function(){
    //get path
    //get module
    path = $('[admin="apath"]').val()
    sub = $('[admin="asub"]').val().trim();
    if(path.length!=9 || sub==''){
      Interface.alert('Invalid Input');
      return;
    }
    if(path.indexOf('/')!=4){
      Interface.alert('Invalid Path: '+path  );
      return
    }
    [major, code] = path.split('/');
    if (major.length!=4 || code.length!=4) {
      Interface.alert('Invalid Path (N4L): '+path  );
      return;
    }

    data = { major:major, code:code, subject:sub, token:Global.token}

    $.ajax({ type: "POST", url: Global.parse(Local.settings.server, 'asub'),
    data: data, timeout: 10000,
      error: function(jqXHR, textStatus, errorThrown) {
        if (Contributor.connection.error==3) {
          Interface.alert('Failed to connect to server. Please try again.');
          Contributor.connection.error=0;
          return
        }
        Contributor.connection.error++;
          if(textStatus==="timeout") {
            console.log(jqXHR);
            console.log(errorThrown);
            console.log('timeout. retrying......');
            Contributor.Add();
            return;
          }

      },//error
      success:function(result){
        result = JSON.parse(result);
        if(result.message!='' || result.message!=undefined){
          Interface.alert(result.message);
        }
        if(!result.success){
          //paint red
          $('[admin="apath"]').css({color:'var(--red)'})
          $('[admin="asub"]').css({color:'var(--red)'})
          setTimeout(function() {
            $('[admin="apath"]').css({color:'inherit'})
            $('[admin="asub"]').css({color:'inherit'})
          },5000)
          return;
        }else {
          $('[admin="apath"]').val('');
          $('[admin="asub"]').val('');
          Global.fetch();
        }

      }//success

    });










  },


  Remove:function(){
    //get path
    //get module
    path = $('[admin="rpath"]').val()
    sub = $('[admin="rsub"]').val().trim();
    if(path.length!=9 || sub==''){
      Interface.alert('Invalid Input');
      return;
    }
    if(path.indexOf('/')!=4){
      Interface.alert('Invalid Path: '+path  );
      return
    }
    [major, code] = path.split('/');
    if (major.length!=4 || code.length!=4) {
      Interface.alert('Invalid Path (N4L): '+path  );
      return;
    }

    data = { major:major, code:code, subject:sub, token:Global.token}

    $.ajax({ type: "POST", url: Global.parse(Local.settings.server, 'rsub'),
    data: data, timeout: 10000,
      error: function(jqXHR, textStatus, errorThrown) {
        if (Contributor.connection.error==3) {
          Interface.alert('Failed to connect to server. Please try again.');
          Contributor.connection.error=0;
          return
        }
        Contributor.connection.error++;
          if(textStatus==="timeout") {
            console.log(jqXHR);
            console.log(errorThrown);
            console.log('timeout. retrying......');
            Contributor.Remove();
            return;
          }

      },//error
      success:function(result){
        result = JSON.parse(result);
        if(result.message!='' || result.message!=undefined){
          Interface.alert(result.message);
        }
        if(!result.success){
          //paint red
          $('[admin="rpath"]').css({color:'var(--red)'})
          $('[admin="rsub"]').css({color:'var(--red)'})
          setTimeout(function() {
            $('[admin="rpath"]').css({color:'inherit'})
            $('[admin="rsub"]').css({color:'inherit'})
          },5000)
          return;
        }else {
          $('[admin="rpath"]').val('');
          $('[admin="rsub"]').val('');
          Global.fetch();
        }

      }//success

    });
  },

  Load: function(){
    if(Contributor.Queue.unverified.length==0){
      Interface.alert('Nothing to verify.');
      return;
    }

      var token = Contributor.Queue.unverified.pop();
      answer = null;
      $('[admin="path"]').val(token.path);

      if(token.hasOwnProperty('answer')){
        answer = token['answer'];
        console.log('Answer: ' +answer);
      }
      index = -1;
      ['question','answer','c1','c2','c3'].map(function(foo,i){
        $(`[admin="${foo}"]`).val(token['form'][i]);
        if(token['form'][i]==answer){
          console.log('Answer in: '+String(i-1));
          index=i-1;
        }
      });
      if(index!=-1){
        Contributor.Switch(index, "var(--green)");
        $('[admin="note"]').html(`${answer}`)
      }
      else if (answer!=null) {
        $('[admin="answer"]').css({color:"var(--red)"})
        $('[admin="note"]').html(`Suggested: ${answer}`);
      }
      else{
        $('[admin="answer"]').css({color:"var(--red)"})
        $('[admin="note"]').html('');
      }

    Contributor.Count();

  },
  Count:function(){
    $('[admin="queue"]').html(`<span content="emphasize">${Contributor.Queue.unverified.length}</span>`)
    if(Contributor.connection.uploading){return;}
    if(this.Queue.verified.length==0){
      $('[admin="verified"]').html(``);}
    else if (this.Queue.verified.length==1 ) {
      $('[admin="verified"]').html(` (${this.Queue.verified.length} token) `);
    }
    else {
      $('[admin="verified"]').html(` (${this.Queue.verified.length} tokens) `);
    }
  },
  Queue: {
    verified:[],
    unverified:[]
  },
  log:function(){
    console.log(this.Queue);
  }
}
