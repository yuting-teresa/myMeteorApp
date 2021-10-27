export const testFuncCall = function () {
    console.log('A server function is called!');
};

export const printProfile = function (profile) {
    if(!profile.age){
      throw new Meteor.Error(500,'There is no age information!');
    }
    let msg = 'The username is %n, who is %a-year-old.';
    msg = msg.replace('%n', profile.name);
    msg = msg.replace('%a', profile.age);
    return msg;
};

export const addUpdateProfile = function (profile){
    userData.update(
        {name: profile.name, type: profile.type},
        {$set: {gender: profile.gender, age: profile.age, score: profile.score}, $setOnInsert:{createdAt: new Date()}},
        {upsert: true}
        );
    };

    
//新增或更新分數
export const updateScore = function (vocabData){
    ansRecords.update(
        {name : vocabData.name},
        {$set: {score: vocabData.score}, $setOnInsert:{createdAt: new Date()}},
        {upsert: true}
    );
};

