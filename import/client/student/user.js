import{Tracker} from 'meteor/tracker';
import './user.html';


Template.user.helpers({
    userSession:function(){
    	return Session.get('userSession');
    }
});

Template.userIndex.onCreated(function(){
	//this.username='Teresa';
	Tracker.autorun(function(){
        Meteor.subscribe('userProfile', Session.get('username'));
	});
	
	this.userProfile = {
		name: '',
		type: 'student',
		gender: 'transgender',
		age:0,
		score:0
	};
});

Template.userIndex.helpers({
    profileKey: function(key){
    	let profile = userData.findOne();
    	return profile && profile[key];
    }
});


Template.userIndex.events({
	'click input[type="radio"]': function(event) {
		Template.instance().userProfile.gender = event.target.value;
	},
	'submit form': function(event){
		event.preventDefault();
		let newProfile = Template.instance().userProfile;
		newProfile.name = document.getElementById('name').value;
        Session.set('username',newProfile.name);
		//Template.instance().username=newProfile.name;
		//console.log(Template.instance().username);
		newProfile.age = Number(document.getElementById('age').value);
		Meteor.call('serverWindow', {funcName: 'addUpdateProfile', info: newProfile});
		
	},
	'click button#assignLecturer': function(){
        let name = document. getElementById('lecturerName').value;
        Meteor.call('serverWindow', {
           funcName: 'addstudentName',
           info: {
           	studentName: Sesstion.get('username'),
           	lecturerName: name
           }
        });
	},

	'click button#vocab': function(){
    Session.set('userSession', 'vocab');
  },

	'click button#writing': function(){
            Session.set('userSession', 'writing');
             },
    'click button#testFuncCall': function(){
    	Meteor.call('serverWindow', {funcName: 'testFuncCall'});
    },

    'click button#printProfile': function(){
		let profile = {
			name: 'YTL',
			age: 30,
			dob: '1991-06-22',
			gender: 'female',
			handedness: 'right'

		    };
		    //Synchrounous coding
            //let result = Meteor.call('printProfile', profile);
            //console.log(result); 
            //Asynchrounous coding
            Meteor.call('serverWindow', {funcName: 'printProfile', info: profile}, 
            	function(err,res){
            	    //Callback function
            	    if (err){
                        console.log(err.reason);
            	    }
            	    else{
            		    console.log(res);
            	    }

            });
            console.log('The end of the function.');
    }
});
       
Template.vocab.onCreated(function(){
	this.vocabData = {
		name: '',
		score:0
	};
});

Template.vocab.events({
	'submit form': function(event){
		event.preventDefault();

		let netAnsRecords = Template.instance().vocabData;
		netAnsRecords.name = document.getElementById('name').value;

		
		let question1List=document.getElementsByName("choice1"); 
		let question1Score;
		question1List.forEach((option)=>{
			if(option.checked){
				question1Score = JSON.parse(option.value);
			}
		})

		let question2List= document.getElementsByName("choice2");
		let question2Score;
		question2List.forEach((option)=>{
			if(option.checked){
			question2Score = JSON.parse(option.value);
		    }
		}) 

		let question3List= document.getElementsByName("choice3");
		let question3Score;
		question3List.forEach((option)=>{
			if(option.checked){
			question3Score = JSON.parse(option.value);	
			}
		})
		
		let totalScore=question1Score+question2Score+question3Score;
		//console.log(totalScore);

		netAnsRecords.score=totalScore;
		
		Meteor.call('serverWindow', {funcName: 'updateScore', info: netAnsRecords});
	},

});

Template.vocab.events({
	'click button': backToHome	
});

Template.writing.onCreated(function(){
	Tracker.autorun(function(){
		Meteor.subscribe('writingProjects', Session.get('username'));
		Meteor.subscribe('studentWritings', Session.get('username'), Session.get('projectName'));
        let forms = document.querySelectorAll('article > form');
        for(let i=0; i<forms.length; i++){
        	forms[i].style.display = 'none';
        }

		if(!studentWritings.findOne()){
            Tracker.afterFlush(function(){
               let articleId =Session.get('projectName');
               let article = document.getElementById(articleId);
               let form = article.querySelector('form');
               form.style.display = 'block';
            });
		}
	});
});

Template.writing.helpers({
	allProjects: function(){
		return writingProjects.find({});
	},
	allWritings: function(projectTitle){
		return studentWritings.find({project: projectTitle}, {sort: {createdAt: -1}});
	}
});

Template.writing.events({
	'click article': function(event){
       let title = event.target.id;
       Session.set('projectName', title); 
	},
	'click section':function(event){
       event.stopPropagation();
       let id = event.target.id; //this.id would work
       Session.set('writingID', id);
       Session.set('userSession', 'writingTools');
	},
	'click form': function(event){
       event.stopPropagation();   
	},
	'submit form': function(event){
       event.preventDefault(); //Stop the dedault reloading action.
       let articleId = Session.get('projectName');
       let article = document.getElementById(articleId);
       let textarea = article.getElementsByTagName('textarea');
       let texts = textarea[0].value;
       Meteor.call('serverWindow', {
       	funcName: 'submitReplyWriting',
       	info: {
       		project: articleId,
       		texts:texts,
       		type: 'student',
       		studentName: Session.get('username'),
       		lecturerName: userData.findOne().lecturer
       	}
       });
	},
	'click button': backToHome
});

function backToHome(){
	Session.set('userSession','userIndex');
}

Template.writingTools.onCreated(function(){
	Tracker.autorun(function(){
		Meteor.subscribe('studentWritingsById', Session.get('writingID'));
	});
});
Template.writingTools.helpers({
	writingRec: function(key){
		let doc = studentWritings.findOne();
		return doc && doc[key];
	}
});
Template.writingTools.events({
	'click button#submitNew': function(){
      let bodyTextarea = document.querySelector('p> textarea');
      let bodyTexts = bodyTextarea.value;
		Meteor.call('serverWindow', {
       	funcName: 'submitReplyWriting',
       	info: {
       		project: Session.get('projectName'),
       		texts:bodyTexts,
       		type: 'student',
       		studentName: Session.get('username'),
       		lecturerName: userData.findOne().lecturer
       	}
       });
		Session.set('userSession', 'writing');
	},
	'click button#save': function(){
      let bodyTextarea = document.querySelector('p> textarea');
      let bodyTexts = bodyTextarea.value;
      Meteor.call('serverWindow',{funcName: 'submitReplyWriting',
                                   info:{
                                   	 id: Session.get('writingID'),
                                   	 texts: bodyTexts,
                                   	 save: true
                                   }}
      );
      Session.set('userSession', 'writing');
	},
	'click button#backToProjects': function(){
		Session.set('userSession', 'writing');
	}
});