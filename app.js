//Retrieving data from the Json file
let quizDataPromise;
let quizData;

quizDataPromise = fetch('data/quiz-data.json').then(function(response){
    return response.json();
}).catch(function(error){
    console.log("bis : Something went wrong with retreiving the quiz-data!");
    console.log(error);
    return [];
});

const formElt = document.getElementById('quiz-form');

quizDataPromise.then(function(quizData){
    //populate your cards here
    const numberOfQuestions = quizData.length;

    for(let i = 0; i < numberOfQuestions; i++){  
    const cardElts = document.createElement("div");
    cardElts.className = "card";
    
    //Add the audio source
    const sourceElt = document.createElement("source");
    sourceElt.src = "audios/" + quizData[i].audio;
    sourceElt.type="audio/mp3";
    const formatNotSupportedElt = document.createTextNode("Your browser does not support the audio element.");
    const audioElt = document.createElement("audio");
    audioElt.controls = "controls";
    audioElt.appendChild(sourceElt);
    audioElt.appendChild(formatNotSupportedElt);

    //Add the options section
    const optionsElt = document.createElement("div");
    optionsElt.className = "options";
    
    for(let j = 0; j < quizData[i].options.length; j++){  
    //Add countries
    const optionsSingleElt = document.createElement("div");
    optionsSingleElt.className = "options-element";

    let country = quizData[i].options[j].country;
    const inputElt = document.createElement("input");
    inputElt.type = "radio";
    inputElt.name = "q"+i;
    inputElt.id = country;
    inputElt.value = quizData[i].options[j].code;
    
    const labelElt = document.createElement("label");
    labelElt.htmlFor = country;

    const imgElt = document.createElement("img");
    imgElt.src =  "images/" + country + ".svg";
    imgElt.alt = country+"'s national flag";
    labelElt.appendChild(imgElt);
    optionsSingleElt.appendChild(inputElt);
    optionsSingleElt.appendChild(labelElt);

    optionsElt.appendChild(optionsSingleElt);
    }
    
    cardElts.appendChild(audioElt);
    cardElts.appendChild(optionsElt);

    formElt.appendChild(cardElts);
}
});
