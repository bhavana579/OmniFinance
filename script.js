const questions=[ 
    { question: "What is net banking also known as?", 
    answers: [
         { text: "Mobile banking", correct:false},
     { text: "Telebanking", correct:false},
      { text: "Internet banking", correct:true},
       { text: "Branch banking", correct:false},
     ] },
     { question: "Which of the following is a step to register for net banking online if you are not a registered member?", 
    answers: [
         { text: "Visit the nearest bank branch", correct:false},
     { text: "Complete the self-registration form with account details", correct:true},
      { text: "Call customer service for registration", correct:false},
       { text: "Send an email to the bank", correct:false},
     ] },
     { question: "What information is typically required to complete the self-registration form for net banking?", 
    answers: [
         { text: "Account number, registered mobile number, CIF number, debit card information", correct:true},
     { text: "Account number, email address, home address, phone number", correct:false},
      { text: "Social Security number, account number, passport number", correct:false},
       { text: "Debit card information, social media accounts, mobile number", correct:false},
     ] },
     { question: "Which of the following is NOT a use of net banking?", 
    answers: [
         { text: "Transferring funds", correct:false},
     { text: "Generating and tracking account statements", correct:false},
      { text: "Paying bills", correct:false},
       { text: "Attending online banking classes", correct:true},
     ] },
     { question: "How can customers avoid missing payment deadlines for bills using net banking?", 
    answers: [
         { text: "Visiting the bank branch", correct:false},
     { text: "Setting up standing instructions", correct:true},
      { text: "Writing cheques in advance", correct:false},
       { text: "Calling customer service", correct:false},
     ] },
     { question: "Which of the following can be easily applied for online using net banking?", 
    answers: [
         { text: "Bank job applications", correct:false},
     { text: "Legal services", correct:false},
      { text: "Credit card disputes", correct:false},
       { text: "Loans", correct:true},
     ] },
     { question: "What transaction can be automated using net banking to avoid penalties for late payments?", 
    answers: [
         { text: "Shopping bills", correct:false},
     { text: "Dining expenses", correct:false},
      { text: " Insurance premiums", correct:true},
       { text: "Vacation planning", correct:false},
     ] },
     { question: "Which service allows customers to pay their electronic monthly installments (EMIs) using net banking?", 
    answers: [
         { text: "Automatic teller machines (ATMs)", correct:false},
     { text: "Net banking", correct:true},
      { text: "Bank drafts", correct:false},
       { text: "In-person bank visits", correct:false},
     ] },
     { question: "How can a customer apply for a new debit card or cheque book using net banking?", 
    answers: [
         { text: "By sending a mail to the bank", correct:false},
     { text: "By visiting the nearest ATM", correct:false},
      { text: "By applying online through net banking", correct:true},
       { text: "By calling customer service", correct:false},
     ] },
     { question: "What feature of net banking allows customers to track transactions done for specific periods and request account statements?", 
    answers: [
         { text: "Account history summary", correct:false},
     { text: "Transaction notification service", correct:false},
      { text: "Statement request service", correct:true},
       { text: "Account tracking service", correct:false},
     ] },
    ];
      
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.
    question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);

    }

}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";

}


function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}




function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }

}


nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

startQuiz();