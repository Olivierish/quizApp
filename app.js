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

    let questionsCards = [];

    for(let i = 0; i < numberOfQuestions; i++){  
        const cardElt = document.createElement("div");
        cardElt.className = "card";
        
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

            if(j===0)
            inputElt.checked = "checked";

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
        cardElt.appendChild(audioElt);
        cardElt.appendChild(optionsElt);

        questionsCards.push(cardElt);
    }
    console.log(questionsCards);
    for(let i = 0; i < numberOfQuestions; i++){
        formElt.insertAdjacentElement('beforeend',questionsCards[i]);
    }
    const buttonElt = document.createElement("button");
    buttonElt.type = "submit";
    buttonElt.textContent = "Submit";
    formElt.appendChild(buttonElt);

    let userResponses = [];
    const correctAnswers = ['fr','de','ru','ke','jp','it'];
    const emojis = ['✔️','✨','👀','😭','👎'];
    const resultsTitleElt = document.querySelector('.results h2');
    const resultsTextElt = document.querySelector('.note');
    const resultsHelpElt = document.querySelector('.help');
    let verificationTab = [];
    formElt.addEventListener('submit',(e) =>{
        e.preventDefault();
        console.log(document.querySelector('input[name="q1"]:checked').value);
        for(let i = 0; i < numberOfQuestions; i++){
            let inputValue = document.querySelector(`input[name="q${i}"]:checked`).value;
            userResponses.push(inputValue);
        }
        checkUserResults(userResponses);
        userResponses = [];
    });
    function checkUserResults(userEntries){
        for(i = 0; i < userEntries.length; i++){
            if(userEntries[i] === correctAnswers[i]){
                verificationTab.push(true);
            }else{
                verificationTab.push(false);
            }
        }
        console.log(verificationTab);
    }

});
