import './user.html';

Template.user.helpers({
    userSession:function(){
    	return Session.get('userSession');
    }
});
Template.userIndex.onCreated(function(){
	this.userProfile = {
		name: '',
		type: 'student',
		gender: 'transgender',
		age:0,
		score:0
	};
});

Template.userIndex.events({
	'click input[type="radio"]': function(event) {
		Template.instance().userProfile.gender = event.target.value;
	},
	'submit form': function(event){
		event.preventDefault();
		let newProfile = Template.instance().userProfile;
		newProfile.name = document.getElementById('name').value;
		newProfile.age = Number(document.getElementById('age').value);
		Meteor.call('serverWindow', {funcName: 'addUpdateProfile', info: newProfile});
		
		// console.log(newProfile);
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
       
//定義vocab的資料，並對按鈕加入事件
Template.vocab.onCreated(function(){
	this.vocabData = {
		name: '',
		score:0
	};
});

Template.vocab.events({
	'submit form': function(event){
		event.preventDefault();
		//1.建立一個新的vocabData實體
		//2.對實體塞入對應的資料,並進行加總
		//3.在前端呼叫updateScore
		//4.在updateScore方法中寫入mongoDB

		let netAnsRecords = Template.instance().vocabData;
		netAnsRecords.name = document.getElementById('name').value;
		
		//先選出題目所有的選項後一一偵測，取出被選取的值寫入question1Score
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
		
		//取得所有題型後做加總
		let totalScore=question1Score+question2Score+question3Score;
		console.log(totalScore);

		//加總後選入原本的vocabData
		

		

		//呼叫後端方法，更新資料至資料庫
		Meteor.call('serverWindow', {funcName: 'updateScore', info: netAnsRecords});
	},
});

//返回首頁
Template.vocab.events({
	'click button': backToHome	
});

Template.writing.events({
	'click button': backToHome
});

function backToHome(){
	Session.set('userSession','userIndex');
}