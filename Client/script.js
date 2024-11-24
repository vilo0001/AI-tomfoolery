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
    The theme of the project should be: ${theme}.
    The difficulty of the project should be: ${difficulty}.
    The project should focus on teaching the students: ${learningGoal}.
    
    Do not include sample code in your answer - only task headlines and descriptions.`);
})

function answeredFilledOut () {
    try {
        difficultyDOM = document.querySelector("input[name='difficulty']:checked");
        learningGoalsDOM = document.querySelector("input[name='learning-goals']:checked");
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
            const paragraphElement = document.createElement("p");
            const text = document.createTextNode(suggestionData.choices[0].message.content);
            paragraphElement.appendChild(text);
            const answerDOM = document.querySelector("#answer");
            answerDOM.appendChild(paragraphElement);
        })
}