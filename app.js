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
            let id = quizData[i].options[j].id;

            const inputElt = document.createElement("input");
            inputElt.type = "radio";
            inputElt.name = "q"+i;
            inputElt.id = `c${id}`;
            inputElt.value = quizData[i].options[j].code;
            if(j===0)
            inputElt.checked = "checked";

            inputElt.addEventListener('change',userInputsHandler);

            const labelElt = document.createElement("label");
            labelElt.htmlFor = `c${id}`;
            labelElt.title = country;

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
        for(let i = 0; i < numberOfQuestions; i++){
            let inputValue = document.querySelector(`input[name="q${i}"]:checked`).value;
            userResponses.push(inputValue);
        }
        checkUserResults(userResponses);
        userResponses = [];
    });

    /**************** */
    // FUNCTIONS
    /**************** */
    function checkUserResults(userEntries){
        for(i = 0; i < userEntries.length; i++){
            if(userEntries[i] === correctAnswers[i]){
                verificationTab.push(true);
            }else{
                verificationTab.push(false);
            }
        }
        displayResults(verificationTab);
        cardsBgColorChange(verificationTab);
        verificationTab = [];
    }
    function displayResults(resTab){
        const failsCounter = resTab.filter(el => el!==true).length;
        const resCounter = resTab.length;
        switch(failsCounter){
            case 0:
                resultsTitleElt.innerText = `${emojis[0]} Great, all your answeers are correct ! ${emojis[0]}`;
                resultsHelpElt.innerText = "";
                resultsTextElt.innerText = `${resCounter} / ${resCounter}`;
                break;
            case 1:
                resultsTitleElt.innerText = `${emojis[1]} Great! ${emojis[1]}`;
                resultsHelpElt.innerText = "Try a different answer on the red card";
                resultsTextElt.innerText = `${resCounter - failsCounter} / ${resCounter}`;
                break;
            case 2:
                resultsTitleElt.innerText = `${emojis[1]} Almost there! ${emojis[1]}`;
                resultsHelpElt.innerText = "Try a different answer on the 2 red cards";
                resultsTextElt.innerText = `${resCounter - failsCounter} / ${resCounter}`;
                break;
            case 3:
                resultsTitleElt.innerText = `${emojis[1]} Not bad! ${emojis[1]}`;
                resultsHelpElt.innerText = "Try a different answer on the 3 red cards";
                resultsTextElt.innerText = `${resCounter - failsCounter} / ${resCounter}`;
                break;
            case 4:
                resultsTitleElt.innerText = `${emojis[2]} Try again! ${emojis[2]}`;
                resultsHelpElt.innerText = "Try a different answer on the 4 red cards";
                resultsTextElt.innerText = `${resCounter - failsCounter} / ${resCounter}`;
                break;
            case 5:
                resultsTitleElt.innerText = `${emojis[2]} Try again! ${emojis[2]}`;
                resultsHelpElt.innerText = "Try a different answer on the 5 red cards";
                resultsTextElt.innerText = `${resCounter - failsCounter} / ${resCounter}`;
                break;
            default:
                resultsTitleElt.innerText = `${emojis[3]} ooops! ${emojis[3]}`;
                resultsHelpElt.innerText = "Try a different answer on the 5 red cards";
                resultsTextElt.innerText = `${resCounter - failsCounter} / ${resCounter}`;

        }
    }
    function cardsBgColorChange(tab){
        for (let i = 0; i < tab.length; i++) {
            if(tab[i] ===true){
                questionsCards[i].style.backgroundColor = '#91ffb6';
            }
            else{
                questionsCards[i].style.backgroundColor = '#ffa2c2';
                questionsCards[i].classList.add("failure");
                //Remove the failure class, in case the user failed again the animation 
                //we will be triggered again
                setTimeout(()=>{
                    questionsCards[i].classList.remove("failure");
                }, 500);

            }
        }
    }

    function userInputsHandler(e){
        let inputElt = e.target;
        let optionsElt = inputElt.parentNode.parentNode;
        let cardElt = optionsElt.parentNode;

        if(inputElt.id === optionsElt.childNodes[0].firstChild.id){
            optionsElt.childNodes[0].childNodes[1].childNodes[0].classList.remove("isSelected");
            optionsElt.childNodes[1].childNodes[1].childNodes[0].classList.add("isSelected");
            optionsElt.childNodes[2].childNodes[1].childNodes[0].classList.add("isSelected");
            /*If the user changes his answer after he submited, 
            reset the background to the original color : white*/
            cardElt.style.backgroundColor = 'white';

        }
        else if(inputElt.id === optionsElt.childNodes[1].firstChild.id){
            optionsElt.childNodes[0].childNodes[1].childNodes[0].classList.add("isSelected");
            optionsElt.childNodes[1].childNodes[1].childNodes[0].classList.remove("isSelected");
            optionsElt.childNodes[2].childNodes[1].childNodes[0].classList.add("isSelected");

            cardElt.style.backgroundColor = 'white';
        }
        else if(inputElt.id === optionsElt.childNodes[2].firstChild.id){
            optionsElt.childNodes[0].childNodes[1].childNodes[0].classList.add("isSelected");
            optionsElt.childNodes[1].childNodes[1].childNodes[0].classList.add("isSelected");
            optionsElt.childNodes[2].childNodes[1].childNodes[0].classList.remove("isSelected");

            cardElt.style.backgroundColor = 'white';
        }
    }
});
