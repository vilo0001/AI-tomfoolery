// Check if the API key is already stored in localStorage
let OPENAI_API_KEY = localStorage.getItem('OPENAI_API_KEY');

if (!OPENAI_API_KEY) {
    // Prompt the user to input the API key if it's not found in localStorage
    OPENAI_API_KEY = prompt("Insert API key.");

    // Save the API key to localStorage for future use
    if (OPENAI_API_KEY) {
        localStorage.setItem('OPENAI_API_KEY', OPENAI_API_KEY);
    }
}

const themeDOM = document.querySelector("#theme");
const answerDOM = document.querySelector("#answer");
let difficultyDOM;
let learningGoalsDOM;

const submitButtonDOM = document.querySelector("#submit");
submitButtonDOM.addEventListener("click", ()=> {
    if(!answeredFilledOut()) alert("Please fill out all questions.");
    const theme = themeDOM.value;
    const difficulty = difficultyDOM.value;
    const learningGoal = learningGoalsDOM.value;

    logSuggestion(`Create an educational project assignment in JavaScript meant
    for a first semester student in software development. Create step-by-step tasks 
    for the student.
    Do not refer to the students in third person.
    The theme of the project should be: ${theme}.
    The difficulty of the project should be: ${difficulty}.
    The project should focus on teaching the students: ${learningGoal}.
    
    When you write a title, have "###" in the start and end of the sentence.
    When you write a headlines, have "##" in the start and end of the sentence.
    When you write a paragraph, have "#" in the start and end of the sentence.
    When you write bullet points, have "*" in the start and end of the sentence.
    ONLY WRITE YOUR ANSWER WITH THESE REQUIREMENTS. MAKE SPACE BETWEEN TAGS LIKE "###" AND "##".
    
    Do not include sample code in your answer - only task headlines and descriptions.`);
})

function answeredFilledOut () {
    try {
        difficultyDOM = document.querySelector("input[name='difficulty']:checked");
        learningGoalsDOM = document.querySelector("input[name='learning-goals']:checked");
        // Tjek om difficulty/learningGoals er null.
        const difficulty = difficultyDOM.value;
        const learningGoal = learningGoalsDOM.value;
        return true;
    }
    catch (error) {
        return false;
    }
}

console.log(OPENAI_API_KEY);

function logSuggestion(content) {
    document.getElementById("form").style.display = "none";
    const paragraphElement = document.createElement("p");
    const text = document.createTextNode("Loading...");
    paragraphElement.appendChild(text);
    answerDOM.appendChild(paragraphElement);

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: content
            }]
        })
    })
        .then(response => response.json())
        .then(suggestionData => {
            answerDOM.innerHTML = "";

            let sentences = suggestionData.choices[0].message.content.split("\n");
            for(let i=0; i<sentences.length; i++) {
                if(sentences[i] === "") {
                    sentences.splice(i,1);
                }
            }
            console.log(sentences);
            for(let i=0; i<sentences.length; i++) {
                parseWords(sentences[i].split(" "));
            }
        })
}

function parseWords (words) {
    let tempString = "";
    let i = 0;
    while (i < words.length) {
        if(words[i] === "###") {
            i++;
            while(words[i] !== "###") {
                tempString += words[i] + " ";
                i++;
            }
            i++;
            createElement("h1", tempString);
            tempString = "";
        }
        else if(words[i] === "##") {
            i++;
            while(words[i] !== "##") {
                tempString += words[i] + " ";
                i++;
            }
            i++;
            createElement("h2", tempString);
            tempString = "";
        }
        else if(words[i] === "*") {
            i++;
            while(words[i] !== "*") {
                tempString += words[i] + " ";
                i++;
            }
            i++;
            // I'm not gonna bother making an actual list...
            tempString = "* " + tempString;
            createElement("p", tempString);
            tempString = "";
        }
        else if(words[i] === "#") {
            i++;
            while(words[i] !== "#") {
                tempString += words[i] + " ";
                i++;
            }
            i++;
            createElement("p", tempString);
            tempString = "";
        }
    }
}

function createElement (tag, text) {
    const element = document.createElement(tag);
    const textNode = document.createTextNode(text);
    element.appendChild(textNode);
    answerDOM.appendChild(element);
}