var Local = {
  settings:{
    toggle:{
      admin:false,
      darkmode:false,
      statistics:true,
      explanation:true,
      links:true,
      promodoro:true,
    },
    server:'AKfycbxAE5zivioJ2D4HE_SFbbJzfKhChICRZrwaAkH1-0GPjL1iNrja'
  },
  //userdata
  userdata:{
    username:'',
    password:'',
    rank:'Newbie',
    star:0,
    correct:0,
    mcq:0,
    timestamp:0,
    token:'T2ZDb3Vyc2VJU3RpbGxMb3ZlWW91',
  },
  //localdata
  bank:{
  active:[],
  subject:{},
  major:{},
  },
  //history
  history:{
    latest:{},
    index:0,
    array:[]
  },
  //Update local Storage
  update:{
    settings:function(target, state){
      //check eligibility
      //update
      //strore
      if(!Local.settings.toggle.hasOwnProperty(target)){
        console.log('no props for '+target);
        return;
      }
      Local.settings.toggle[target] = Boolean(state || 0);
      Local.set('preferences',Local.settings.toggle);
      console.log('calling '+target+'...');
      Interface.toggle[target](state);

    },
    userdata:function(){
      Local.set('userdata',Local.userdata)
    },
    history:function(token){
      //var cache=JSON.parse(JSON.stringify(token));
      Local.history.array.unshift(token);
      if(Local.history.array.length==10){
        Local.history.array.pop();
      }
    },
    queue:function(){
      Local.set('savedata', Contributor.Queue);
    },
    bank:function(){
      Local.set('localdata', Local.bank)
    },
    statistics:function(correct=false){
      if(!Local.settings.toggle.statistics){ return; }
      Local.userdata.mcq++;
      if(correct){
        Local.userdata.correct++;
      }
      rate = (100*(Local.userdata.correct/Local.userdata.mcq)).toFixed(2);
      rate = `${rate}%`;
      $('[statistics="rate"]').css({width:rate});

      $('[statistics="correct"]').text(Local.userdata.correct);
      $('[statistics="total"]').text(Local.userdata.mcq);
      $('[statistics="crate"]').text(rate);
      Local.set('userdata', Local.userdata);
      //get userdata
      //run compute rate
      //render gui
    }
  },//End of update
init:function() {
  settings = Local.get('preferences');
    console.log(typeof(settings));
    if(!typeof(settings)=='object' || settings==undefined){
      Local.set('preferences',Local.settings.toggle);
      console.log('settings initialized');
    }else{
      //verify
      console.log(settings);
       Local.settings.toggle = settings;
      console.log('Settings loaded');
      console.log(Local.settings.toggle);
    }

    //set settings
    $('[setting]').each(function(pref){
      p = $(this).attr('toggle');
      if(!Local.settings.toggle.hasOwnProperty(p)){
        console.log('no props '+ p);
        return;
      }
      if(Local.settings.toggle[p]==true) {
        console.log(p+':true');
        $(this).attr('checked','true')
        Interface.toggle[p](true);
      }
        else {
          console.log(p+':false');
        }
    })
  userdata = this.get('userdata');
    if(!typeof(userdata)=='object' || userdata==undefined){
      Local.set('userdata',Local.userdata)
      //login form
      console.log('userdata initialized');
    }else{
      this.userdata=userdata;
      console.log('userdata loaded');
    }
  //set userdata

   $('[login="username"]').val(Local.userdata.username)
   $('[login="password"]').val(Local.userdata.password)
   $('[contribute="token"]').val(Local.userdata.token)

   Global.login();
   //run stats
   rate = (100*(Local.userdata.correct/Local.userdata.mcq)).toFixed(2);
   rate = `${rate}%`;
   $('[statistics="rate"]').css({width:rate});

   $('[statistics="correct"]').text(Local.userdata.correct);
   $('[statistics="total"]').text(Local.userdata.mcq);
   $('[statistics="crate"]').text(rate);
   //Local.update.statistics();


  bank = Local.get('localdata');
    if(!typeof(bank)=='object' || bank==undefined){
      Global.fetch();
      console.log('bank initialized');
    }else{
      //request data
      if(Local.bank.subject.length==0 || Local.userdata.timestamp==0){
        console.log('requesting data');
        Global.fetch();
      }
      this.bank = bank;
      Bank.init();
    }
    //queue
    savedata = Local.get('savedata');
      if(!typeof(bank)=='object' || savedata==undefined){
        Local.set('savedata', Contributor.Queue);
        console.log('savedata initialized');
      }else {
        Contributor.Queue = savedata;
      }



},//end of initial
get:function(entry, local=true){
  cache = localStorage.getItem(entry);
  try {
    console.log('data '+entry);
    return JSON.parse(cache);
  } catch (e) {
    console.log('no data for '+entry);
    return undefined;
  }
},
set:function(item, data){
  if(typeof(data)=='object'){
    localStorage.setItem(item, JSON.stringify(data));
  }else{
    console.error('Failled to store '+item +typeof(data));
    console.error(data);
  }
},
import:function(module,major){
  //verify
  if(major.length==0){
    console.log('empty major');
    return;}
  if(module.length==0){
    console.log('empty module');
    return;}
  //major
  major.map(m=>{
    Local.bank.major[m.code] = m.major;
    console.log(m);
  });

  module.map(m=>{
    Local.bank.subject[m.code] = {count:m.data.length, name:m.subject};
    Local.set(m.code, m)
  });
  Local.set('localdata', Local.bank);
  Bank.init();
}

};//End of Local



var Global = {
  logging:false, online:false, token:'', error:0,
  parse:function(s, request){
    return `${String(atob('aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy8='))}${s}${String(atob('L2V4ZWM='))}?request=${request.trim()}`
  },
  ping:function(){
    l = Global.parse(Local.settings.server, 'ping');
    console.log(l);
    $.getJSON(l, function (json) {
      console.log('Connected to server..');
      console.log(JSON.stringify(json));
      console.log(json.data);
      })
      .fail(function(){
        console.log('Ping Failed..')
      });
  },
  fetch:function(){
    l = Global.parse(Local.settings.server, 'fetch');
    console.log(l);
    $.getJSON(l, function (json) {
      console.log('Connected to server..');
      console.log(JSON.stringify(json));
      console.log(json.data);
      //check logs or notiff
      Local.import(json.data, json.info);
    }).fail(function(){
      Local.userdata.timestamp = 0;
      console.log('Fetch Failed..') });
  },

  login:function(){
    //get login
    //
    //prepare login form
    // username, password, correct, rate, token

    if(Global.logging){
      Interface.alert('Logging in...');
      return;
    }
    console.log('LOGIN');
    username = $('[login="username"]').val().trim();
    password = $('[login="password"]').val().trim();
    if(username=='' || password==''){return; }
    Global.logging = true;
    $('[profile="logging"]').attr('status', 'active');
    $('[profile="login"]').attr('status', 'idle');
    console.log('Password: '+ JSON.stringify({password:btoa(password)}));

    $.ajax({ type: "POST", url: Global.parse(Local.settings.server, 'login'),
    data: {
      username:username,
      password:btoa(password),
      token:$('[contribute="token"]').val().trim(),
      correct:Local.userdata.correct,
      rate: (Local.userdata.correct/Local.userdata.mcq).toFixed(2)
    },
    timeout: 10000,
      error: function(jqXHR, textStatus, errorThrown) {
        Global.logging=false;
        if(Global.error<3){ Global.error++; Global.login(); return; }
          Interface.alert('Login Failed.');
          $('[profile="logging"]').attr('status', 'idle');
          $('[profile="login"]').attr('status', 'active');
      },//error
      success:function(result){
        //expectations => acount, badge, contributor, rank, timestamp
        // {"login":true,"details":"","admin":false,"rank":"Newbie","star":0,"stamp":1593177610132}
        console.log('Login');
        console.log(result);
        result = JSON.parse(result)
        data = result.data;
        feeds = result.info;
        if(typeof(data.message)=='string'){ Interface.alert(data.message)}
        if(!data.login){
          Global.logging=false;
          $('[profile="logging"]').attr('status', 'idle');
          $('[profile="login"]').attr('status', 'active');
          return; }
        //if Admin
        if(data.admin){
          $('[admin="toggle"]').attr('status','active');
          Global.token = data.token;
          Contributor.init();
        };
        // {"login":true,"details":"","admin":false,"rank":"Newbie","star":0,"stamp":1593177610132}
        //if timestamp == update/fetch
        if(Local.userdata.timestamp!=data.timestamp){
          Local.userdata.timestamp = data.timestamp;
          Global.fetch();
        }
        //move everything to userdata
        if(Local.userdata.rank!=data.rank || Local.userdata.star!=data.star){
          Interface.alert('You Ranked Up!')
        }

        rank = `${data.rank} `;
        for (var i = 0; i < 5; i++) {
          rank+=`&star${(i<data.star)? 'f':''};`
        }
        //save userdata
        username = $('[login="username"]').val().trim();
        password = $('[login="password"]').val().trim();
        Local.userdata.username=username;
        Local.userdata.password=password;
        Local.userdata.rank=data.rank
        Local.userdata.star=data.star
        Local.update.userdata();
        //Ready profile
        $('[user="username"]').html(username);
        $('[user="rank"]').html(rank);
        //set ranks
        //Local.update.statistics(null);
        //Set View
        $('[profile="logging"]').attr('status', 'idle');
        $('[profile="user"]').attr('status','active');
        //reset
        $('[login="username"]').val('');
        $('[login="password"]').val('');
        Global.online=true;
        Global.logging=false;
        Interface.renderFeed(feeds);
      }//success
  });
  },
}


Bank = {
  init:function(){
    $('[module]').unbind();
    major = Object.keys(Local.bank.major)
    subject = Object.keys(Local.bank.subject)
    active = Local.bank.active;
    if(subject.length==0 || major.length==0){
      console.log('Bank is currently empty');
      console.log(major);
      console.log(subject);
      return
    };
    //$('#questionBankStats').attr('status','idle')
    $('[admin="path"]').html('<option value="default">-- Select Subject --</option>');
    $('[admin="module"]').html('<option value="default">-- Select Subject --</option>');
    $('[bank="module"]').html('');
    html='';
    major.map(m=>{
      opt='';
      html+=`<span content="title-small">${m} -<span content="note"> ${Local.bank.major[m]}</span></span>`
      html+=`<div class="container"><table major="${m}"></table></div>`
      //Admin
      subject.map(s=>{
        if(s.startsWith(m)){
          console.log(m+': '+Local.bank.subject[s].name);
          opt+=`<option value="${s}">${Local.bank.subject[s].name}</option>`
        }
      });
      opt = `<optgroup label="${Local.bank.major[m]}">${opt}</optgroup>`
      $('[admin="path"]').append(opt);
      $('[admin="module"]').append(opt);
    });

    $('[bank="module"]').append(html);
    count = 0;
    subject.map(s=>{
      sub = (Local.bank.subject[s]);
      check = ''
      if(active.includes(s)){
        check = 'checked';
        cache = Local.get(s,false)
        tokens = cache.data
        Bank.Token = Bank.Token.concat(tokens);
      }

      [parent,code] = s.split('/');
      html = `<td class="toggle-label">${sub.name}</td>`
      html+= `<td class="count alignRight" >${sub.count}</td>`
      html+= `<td class="toggle alignRight"><label class="switch">
      <input type="checkbox" module="${s}" ${check}>
      <span class="slider round"></span></label></td>`
      $(`[major="${parent}"]`).append(`<tr>${html}</tr>`);
      count+=sub.count;
    });

    $('[bank="count"]').html(`Question count:<br><span content="emphasize">${count}</span>`);
    //------------ Bind Modules (Bank) --------------------
    //Toggles
    $('[module]').click(function(){
      toggle = $(this).attr('module');
      state = $(this).is(':checked');
      Bank.toggle(toggle,state)
    });

  },//end init
  toggle:function(toggle,state){
    //verify
    if(!Local.bank.subject.hasOwnProperty(toggle)){
      console.log('Subject '+ toggle+' not found');
      return
    }
    if(state==false){
      console.log('Bank toggle is false');
      subject = Object.keys(Local.bank.subject)
      Bank.Token=[];
      Local.bank.active = Local.bank.active.filter(active =>{
        if(toggle==active) {return false;}
        Bank.Token = Bank.Token.concat(Local.get(active,false).data);
        return true;
      });
      console.log(Local.bank.active);
      Local.update.bank();

      Local.history={
        latest:{},
        index:0,
        array:[]
      },
      console.log(Bank.Token.length);


        return;
      }
      //add
      //get localdata
      //concat
      //add active
      sub = Local.get(toggle,false)
      console.log(sub);
      tokens = sub.data
      console.log(tokens);
      Bank.Token = Bank.Token.concat(tokens)
      Local.bank.active.push(toggle);
      console.log('Added to tokens');

    Local.update.bank();

  },//end toggle
  getToken:function(){
    if(Bank.Token.length==0){
      return
    }
    var token = random.choose(Bank.Token);
    return token;
  },


Token:[]
}





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
};
