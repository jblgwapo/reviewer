var version = '6.6 Beta';
var build = 4500;
var Bank = [{"type":"mcq","question":"lkj","answer":"kj","choices":["lj","lkj","lj"],"major":"GEAS","subject":"Laws","topic":"lkj","explanation":"jk","links":["ljk"],"id":1574396720568,"image":"lkj"}];




var test = function(){
	console.log('test is on going');
  entry = {
    stamp:1234,
    major:'sample',
    subject:'subject',
    question:'this is a question',
    choices:['choice a','choice b','choice c','choice d'],
    image:'none',
    links:[],
    explanation:'explains why',
    contributor:'jb'};
		envelope = {
			contents:[entry],
			action:'push'
		}

  var url = System.url+'?action=push';
  $.post(url, envelope, function (json) {
            console.log(JSON.stringify(json));
    },'json');
}


var cloudUpload = function(){
	console.log('test is on going');
	var stamp = Date.now();
 var contents = [];
 console.log('Mapping the bank from '+stamp);
 Bank.map( function(sample){

	 var token = {
		 stamp:stamp++,
		 major: sample.major,
		 subject: sample.subject,
		 question:sample.question,
		 choices:sample.answer,
		 image: (sample.image||0 ? sample.image: 'none'),
		 links:'none',
		 explanation:(sample.explanation||0 ? sample.explanation: 'none'),
		 contributor:'jbl',
	 };

	 sample.choices.map(function(choice){
		 token.choices += `/jbl/${choice}`;
	 });
	 contents.push(token);
	 console.log('Token');
 });
 console.log('Data is ready. Connecting to database');




	var envelope = {
			contents:atob(JSON.stringify(contents)),
			action:'push'
		}
	console.log(JSON.stringify(envelope));
  var url = System.url+'?action=push';
  $.post(url, envelope, function (json) {
		 				console.log('Online!');
            console.log(JSON.stringify(json));
    },'json');
}


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

var GUI = { version:6.2,
	// Methods for Elements and Classes
	activate: function(modal){
		document.getElementById(modal).style.display='block';},
	terminate: function(modal){
		document.getElementById(modal).style.display='none';},
	killAll: function(className='modal'){
		mode = document.getElementsByClassName(className);
		for(s=0; s<mode.length; s++) mode[s].style.display='none';},
	// User Alerts
	alert: function(alert){
		this.activate('alertScreen');
		document.getElementById('alert').innerHTML = alert;
		},
	// Methods for Contents
	setContent: function(id, content){
		if(!content) return;
		document.getElementById(id).innerHTML = content;},
	setContents: function(className, contents){
		if(!contents) return;
		obj = document.getElementsByClassName(className);
		if(!obj){ return;}
		if(obj.length==null){ console.log('Error setContents.');
		console.log(obj); console.log(contents); return;}
		for(i=0;i<obj.length;i++){
		obj[i].innerHTML = contents[i];}},
	setValue: function(id, value){
		document.getElementById(id).value = value;},
	setValues: function(className, contents){
		if(!contents) return;
		obj = document.getElementsByClassName(className);
		if(!obj){ return;}
		if(obj.length<contents.count){ this.alert('Error setValue.');
		console.log(obj); console.log(contents); return;}
		for(i=0;i<obj.length;i++){ if(contents[i]==null)continue; obj[i].value = contents[i];}},
	setRadio: function(rad, index){
		radio = document.getElementsByName(rad);
		radio[index].checked=true;
	},
	getValue: function(id){
		return document.getElementById(id).value;},
	getValues: function(className){
		obj = document.getElementsByClassName(className);
		if(!obj){ return;} arr=[];
		if(obj.length==null) console.log('Error setContents.');
		for(i=0;i<obj.length;i++) arr.push(obj[i].value);
		return arr;},
	getIndex: function(className, index){
		i = document.getElementsByClassName(className)[index].innerHTML;
		return i;},
	get: function(id){ return document.getElementById(id)},
	getContent: function(id){
		return document.getElementById(id).innerHTML;},
	getRadio: function(rad){
		radio = document.getElementsByName(rad);
		console.log(radio[0].checked);
		for(i=0; i<radio.length;i++){
			console.log(radio[i].checked);
			if(radio[i].checked) {return (i+1);} }
		return 0;},
	clearValues: function(className){
		obj = document.getElementsByClassName('className');
		console.log(obj);
		for(i=0;i<obj.length;i++)obj[i].value='';
		},
	tab: function(tab){
		tabs = document.getElementsByClassName('nav');
		for(i=0;i<4;i++) { tabs[i].style.background = 'none';			tabs[i].style.border = 'none';}
		this.killAll('tab'); this.activate(tab);
		tab += 'Header'; header = document.getElementById(tab);
		header.style.background = 'rgba(4,0,F,0.3)';
		header.style.borderBottom = '2px solid #EEE';
		},
};



var System = { version:6.6,
	  url:"https://script.google.com/macros/s/AKfycbwdlihHyUJEgrmUFHdtBixjHRWxSC-HgvuiyeSmUgDttm5XYR-X/exec",
//Settings
 	preferences:{ darkMode:0, incomplete:0, json:0},
	theme:{ //0 -> light and 1 -> dark
		color:['#111','#EEE'],
		background:['rgb(240,240,240)','rgb(50,50,50)'],
		container:['linear-gradient(rgb(240,240,240),rgb(230,230,230))','linear-gradient(rgb(50,50,50), rgb(40,40,40))'],
		theme:['linear-gradient(#47A, #379)', 'linear-gradient(#E42,#E31)'],
		modal:['#fff', '#444'],
		red:['red','#f55'],
		green:['#0a0','#0f0'],
		lines:['#47A','#F41'],
	},

	darkMode: function(){target = Object.keys(this.theme);
		css=':root{';
		for(i=0;i<target.length;i++){ css+='--'+target[i]+':'
		  +this.theme[target[i]][this.preferences.darkMode]+';';}css+='}';
		GUI.setContent('style',css);},

// Question bank
	template :'<a onclick=System.select("INDEX") href="#select"><div class="token STATUS" ><b>ANSWER</b><b style="float:right">NUMBER</b><br><span>QUESTION</span></div></a>',
	bank: function(){
		cache='';
		console.log(Bank.length);
		if(Bank.length==0){
			GUI.setContent('questionBank', '<p style="align:center">The Bank is Empty.</p>');
			GUI.tab('questionView');
			return;
	 	}
		for(i=0;i<Bank.length;i++){
			token = this.template.replace('INDEX', i);
			token = token.replace('NUMBER', Bank[i].id);
			token = token.replace('ANSWER', Bank[i].answer);
			token = token.replace('QUESTION', Bank[i].question);
			if(Bank[i].topic=='' || Bank[i].explanation=='' || Bank[i].links=='') token=token.replace('STATUS', 'incomplete');
			else token=token.replace('STATUS', 'complete');
			cache=token+cache;
		}
		GUI.setContent('questionBank', cache);
		GUI.tab('questionView');
	},
	select: function(index){
		Creator.load(index);
	},
	search: function(){
		key = GUI.get('id_input').value;
		for(i=0;i<Bank.length;i++){
			if(Bank[i].id==key){Creator.load(Bank[i]); return;}
		};
		GUI.alert('No Match');
	},

//Settings Tab
	toggle: function(prefered){
		target = 'preferences';
		Set = this.preferences[prefered];
		if(Set == null){target='quizScreen';
			Set = this[target][prefered];}
		if(Set == null){ console.log('Nothing to toggle'); return;}
		Button = GUI.get(prefered+'Toggle');
		if(Set==0) {this[target][prefered] = 1;
			Button.style.background='green';
			Button.innerHTML = 'On';}
		else {this[target][prefered] = 0;
			Button.style.background='red';
			Button.innerHTML = 'Off';}
		if(prefered=='darkMode'){ this.darkMode();}},
};



var Creator = {

	init: function(mode=''){
		if(mode=='_'){
			major = GUI.getValue('addSubjectMajor');
			subject = GUI.getValue('addSubjectName');
			if(major=='' || subject==''){ GUI.alert('Invalid Input.'); return;}
			Subjects[major].push(subject);
			GUI.alert('Done!'); GUI.terminate('AddSubject');
		}
		Major = Object.keys(Subjects);
		options = '<option value="">--Select Subject--</option>';
		for(i=0; i<Major.length; i++){
			options+='<optgroup label="'+Major[i]+'">';
			for(s=0;s<Subjects[Major[i]].length;s++){
				dir = Major[i] +'/'+Subjects[Major[i]][s];
				options += '<option value="'+dir+'">'+Subjects[Major[i]][s]+'</option>';
			}
			options+='</optgroup>'
		};
		GUI.setContents('selector', [options,options,options]);
	},

	target:'none',
	minimize: function(){
		this.target='none';
		GUI.terminate('popEditor');
	},

	submit: function(mode=''){
		content = GUI.getValues(mode+'content');
		detail = GUI.getValues(mode+'detail');
		// Find Answer
		if(mode=='_'){
			Ans = GUI.getRadio('_choice');
		   if(Ans==0){
				GUI.alert('Please Select Answer from Choices'); return;}
		   cache = content[Ans];
			content[Ans] = content[1];
			content[1] = cache;
		    };
		// Validate
		token = { type:'mcq',};
		if(content[0]=='' && content[1]==''){
			GUI.alert('Incomplete Content'); return;}
		if(detail[0]==''){ GUI.alert('Select Subject'); return;}
		for(i=2;i<content.length;i++)
			if(content[i]=='') token['type']='id';
		//Prepare
		[major, subject] = detail[0].split('/');
		link = detail[3].split('\n');
		console.log('Link' + link);
		if(detail[3]!=''){
			for(i=0;i<link.length;i++)if (link[i]== ''|| link[i]==' '){
				link.splice(i, 1); i--;}}
		// Integrate
		token['question']=content[0];
		token['answer']=content[1];
		if(token.type=='mcq'){ token['choices']=content.splice(2,3);}
		token['major']=major;
		token['subject']=subject;
		token['topic']=detail[1];
		token['explanation']=detail[2];
		token['links']=link;
		token['id']=Date.now();
		token['image']=GUI.getValue(mode+'imageCache');
		GUI.setValue(mode+'imageCache', '');
		GUI.setValues(mode+'content',['','','','','']);
		GUI.setValues(mode+'detail',[detail[0],detail[1],'','','']);
		console.log(JSON.stringify(token));
		if(this.target=='none') {Bank.push(token);}
		else { Bank[Number(this.target)]=token; this.target='none'; System.bank(); }
		if(mode=='_'){this.bix();};
	},

	parse: function(){
		this.Cache=[];
		item = GUI.getValues('bix');
		GUI.setValue('popSelect',item[0]);
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
		this.parseDebug();
		return;}
		console.log(Buffer);
		len = (Buffer.length/5);
		for(i=0;i<len;i++){
			temp = Buffer.splice(0,5)
			this.Cache.push(temp);
		};
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
			if(answerKey.length==this.Cache.length){GUI.alert('Answer Key is recognized.');
				for(i=0;i<answerKey.length;i++){ this.Answer.push(answerKey[i]);}
			}
			else{ GUI.alert('Answer key not available.');
				console.log(answerKey.length+':')
			};
		}
			console.log(this.Cache.length);
		this.toDo = this.Cache.length;
		this.bix();

		},
	parseDebug:function(){
		item = GUI.getValues('bix');
		err=[];
		Buffer = item[1].split('\n');
		for(i=0; i<Buffer.length; i++){
			dot = Buffer[i].indexOf('.');
			if(dot <5){}
			else { err.push(i); } };
		if(err.length!=0){GUI.alert('Parse Error. Check line(s) '+String(err)+'.' ); return;};

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
					GUI.alert('Missing ' + expected + ' in item ' + number); return;}
			}


		GUI.alert('Parse Error');
	},

	updateBixProgress: function(){
		offset = Number(GUI.getValue('bixOffset'));
		progress = Number(this.toDo) - Number(this.Cache.length) + offset;
		max = Number(this.toDo) + offset;
		console.log(toDo);
		GUI.setContent('progress', String(progress));
		GUI.setContent('toDo', String(max));
	},
	bix: function(){
		if(this.Cache.length==0){ GUI.alert('Done!'); this.toDo=0; GUI.terminate('popEditor'); return;}


		form =this.Cache[0];
		this.Cache.splice(0,1);
		if(this.Answer.length!=0){
			answer = String(this.Answer[0]).trim();
			this.Answer.splice(0,1);
			if(form.indexOf(answer)>0){
				index = form.indexOf(answer)-1;
			GUI.setRadio('_choice', index );
			}
			else{
			GUI.alert('Answer not matched: '+ form.indexOf(answer) + '<br>Answer: ' + answer);
			}
		};
		GUI.setValues('_content',form);
		GUI.activate('popEditor');
		this.updateBixProgress();
		},
	toDo:0,
	Cache:[],
	Answer:[],

// load
	load: function(index){
		if(Bank.length<=index) {GUI.alert('Non Existent'); return;}
		cache = Bank[index];
		contents = [cache.question, cache.answer, cache.choices[0], cache.choices[1], cache.choices[2] ];
		details = [cache.major+'/'+cache.subject, cache.topic, cache.explanation, String(cache.links).replace(',','\n')];
		GUI.setValue('_imageCache', cache.image);
		GUI.setRadio('_choice',0);
		GUI.setValues('_detail', details);
		GUI.setValues('_content',contents);

		GUI.activate('popEditor');
		this.target=Number(index);
	},
	generate: function(){
		GUI.activate('saveView');
		code='';
		if(System.preferences.json){ code='var subjectName = \'TARGET\';'; }
		else{ code='Engine.import(\'TARGET\')';}
		cache=[];
		for(i=0;i<Bank.length;i++){
			if(System.preferences.incomplete==1){ cache.push(Bank[i]); continue; }
			else if(Bank[i].topic=='' || Bank[i].explanation=='' || Bank[i].links=='') {  }
			else { cache.push(Bank[i]);}
		}
		cache = JSON.stringify(cache).replace(/'/g, "\'");
		code = code.replace('TARGET', cache);
		GUI.setValue('rawCode', code);
	},
	discard: function(){
		if(this.target!='none'){
			Bank.splice(this.target,1);
			GUI.terminate('popEditor');
			this.target='none';
			System.bank();
		}
	},
	// Upload and downloads
	uploads:[],
	upload: function(){
		file = document.getElementById('uploadFile').files[0];
		filename = document.getElementById('uploadFile').value;
			console.log('UPLOADING...    ' + filename);
				if(this.uploads.includes(filename)){
					GUI.alert('File Already Exists');
					return;
				}
				else{
				this.uploads.push(filename);
				}

				extension = document.getElementById('uploadFile').value.split('.').pop();
				if (extension != 'jbl'){ GUI.alert('Unsupported File Type. Error ID: JBL-U'); return;}
				if (file) {var reader = new FileReader();
				reader.onload = function (evt) {
					try {
						var obj = JSON.parse(evt.target.result);
						if (obj.file_type == 'JBL' && obj.content.length>0){
							console.log('Importing ' + obj.content.length + ' items.');
							for(i=0; obj.content.length;i++){
								Bank.push(obj.content.pop());
							}
								System.bank();
								GUI.alert('Upload Complete.');
								GUI.terminate('uploadView');
							  }
						else {GUI.alert('Unsupported File Type');}}
					catch(error) {
						GUI.alert('Unsupported File Type. The file you may be trying to run is corrupted. Error ID: JBL-C');
						console.error(error);}};
		 				reader.onerror = function (evt) { console.error("An error ocurred reading the file",evt); };
						reader.readAsText(file, "UTF-8");}

	},
	image: function(mode=''){
		mode = String(mode);
		var image = GUI.get(mode+'image').files[0];
		var reader = new FileReader();
		reader.onload = function(){
			 GUI.setValue(mode+'imageCache', reader.result);
			 GUI.get(mode+'imagePreview').src= reader.result;

		 };
		reader.readAsDataURL(image);
	},
	imagePreview: function(mode=''){
		GUI.get(mode+'imagePreview').src=GUI.getValue(mode+'imageCache');
	},

	download: function(){
		if(Bank.length<=1){GUI.alert('Bank is Empty'); return;}
		filename = GUI.getValue('fileName');
		if(filename=='' || filename==null){ GUI.alert('Set File Name'); return; }
		filename+= '_' + Date.now() + '.jbl';
		code = {file_type:'JBL',};
		code['content'] = Bank;
		cache = JSON.stringify(code).replace(/'/g, "\'");

		var a = document.createElement('a');
					var blob = new Blob([cache], {'type':'jbl'});
					a.href = window.URL.createObjectURL(blob);
					a.download = filename;
					a.click();
	}
};



function Initialize(){
	preferences =['incomplete','json','darkMode'];
	for(i=0; i<preferences.length; i++){
		console.log(preferences[i]);
		System.toggle(preferences[i]);
	}
	GUI.tab('bixView');
	GUI.get('_pasteHere').select();
	Creator.init();
};


// Keyboard

document.addEventListener('keydown', id_return, false);

	function id_return(event) {
		var x = event.keyCode;
		alert = document.getElementById('alertScreen').style.display;
		if(alert=='block') return;

		if(Creator.toDo.length!=0){
			switch (x) {
				case 192:
					Creator.submit('_');
					break;
				case 49:
					GUI.setRadio('_choice',0);
					break;
					case 50:
						GUI.setRadio('_choice',1);
						break;
						case 51:
							GUI.setRadio('_choice',2);
							break;
							case 52:
								GUI.setRadio('_choice',3);
								break;
				default:

			}
		}
      }
