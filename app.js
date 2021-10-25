//Retrieving data from the Json file
let quizDataPromise;
let quizData;
/*
fetch('data/quiz-data.json').then(function(response){
    return response.json();
}).then(function(obj){
    quizData = obj;
    return quizData;
}).catch(function(error){
    console.log("Something went wrong with retreiving the quiz-data!");
    console.log(error);
});
*/

quizDataPromise = fetch('data/quiz-data.json').then(function(response){
    return response.json();
}).catch(function(error){
    console.log("bis : Something went wrong with retreiving the quiz-data!");
    console.log(error);
    return [1];
});


quizDataPromise.then(function(quizData){
    //populate your cards here
    console.log(quizData[0].audio);
});
