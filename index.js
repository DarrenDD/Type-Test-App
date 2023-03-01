//random quotes api

const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Display random quotes
const renderNewQuote = async() =>{
    //fetch content from quote api url
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });

    quoteSection.innerHTML += arr.join("");
};

//Logic to compare input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll("quote-Chars");
    quoteChars = Array.from(quoteChars);

    //Array of user input chars
    let userInputChars = userInput.value.split("");
    //Loop through each char in quote
    quoteChars.forEach((char, index)=>{
        //check chars with quote chars
        if(char.innerText == userInputChars[index]){
            char.classList.add("success");
        }
        //if user hasnt entered anything or backspaced
        else if(userInputChars[index] == null){
            if(char.classList.contains("success")){
                char.classList.remove("success");
            }else{
                char.classList.remove("fail");
            }
        }
        //if user enter wrong char
        else{
            if(!char.classList.contains("fail")){
                //increment and display mistakes
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        //return true if all chars are correct
        let check = quoteChars.every((Element) =>{
            return Element.classList.contains("success");
        });

        //end test if all chars are correct
        if(check){
            displayResult();
        }
    });

});

//Update Timer
function updateTimer(){
    if(timer == 0){
        //end test if reaches 0
        displayResult();
    }else{
        document.getElementById("timer").innerText = --time + "s";
    }
}
//Set timer
const timeReduce = () =>{
    time = 60;
    timer = setInterval(updateTimer, 1000);
};
//End test
const displayResult = () =>{
    //diplay result div
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timerTaken = 1;
    if(timer != 0){
        timerTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput
        .value.length / 5 /timerTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) 
    / userInput.value.length) * 100) + "%";

}

//start test
const startTest = () =>{
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = 
    "none";
    document.getElementById("stop-test").style.display = 
    "block";
};
window.onload = () =>{
    userInput.value = "";
    document.getElementById("start-test").style.display = 
    "block";
    document.getElementById("stop-test").style.display = 
    "none";
    userInput.disabled = true;
    renderNewQuote();

}