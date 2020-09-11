const STORE = {
    questions: [
      {
        question: 'What is Kendrick’s debut album?',
        answers: [
          '<i>To Pimp a Butterfly</i>',
          '<i>Damn.</i>',
          '<i>Overly Dedicated</i>',
          '<i>Section.80</i>'
        ],
        correctAnswer: 'Overly Dedicated'
      },
      {
        question: 'What year was <i>Damn.</i> released?',
        answers: [
          '2017',
          '2012',
          '2019',
          '2015'
          
        ],
        correctAnswer: '2017'
      },
      {
        question: 'What is the most recent song he was featured on?',
        answers: [
            'Wow Freestyle - Jay Rock',
            'New Freezer - Rich the Kid',
            'Nosestalgia -  Pusha T',
            'Tints - Anderson .Paak'            
        ],
        correctAnswer: 'Tints - Anderson .Paak'
      },
      {
        question: 'What is his best song?',
        answers: ['FEAR.',
        'Hol’ Up',
        'Poetic Justice',
        'These Walls'],
        correctAnswer: 'Poetic Justice'
      },
      {
        question: 'What new rapper is his cousin?',
        answers: [
          'Denzel Curry',
          'Larry June',
          'Baby Keem',
          'NLE Choppa'
        ],
        correctAnswer: 'Baby Keem'
      }
    ],
    quizStarted: false,
    currentQuestion: 0,
    score: 0
  };

/********** TEMPLATE GENERATION FUNCTIONS **********/
// These functions return HTML templates

/**
 * Generates HTML for the start screen
 */
function welcomeScreen() {
    return `
      <div class="welcome-screen">
        <p>Think you know everything there is about Kendrick Lamar? Well let's put your knowledge to the test!</p>
        <button type="button" id="begin">Ayo K-Dot!</button>
      </div>
    `;
  }
  

//  Generates the HTML for the section of the app that displays the question number and the score
  
  function questionNumber() {
    let currentQuestion = STORE.questions[STORE.currentQuestion];
    return `
      <div class="question-number">
        <h3>
          Question # ${STORE.currentQuestion + 1}</h3>
          <h4>${currentQuestion.question}</h4>
      </div>
    `;
  }
//   Generates the list of possible answers for one question
   
  function generateanswerOptions() {
    const answersArray = STORE.questions[STORE.currentQuestion].answers
    let answerOptions = '';
    let i = 1;
  
    answersArray.forEach(answer => {
      answerOptions += `
        <div id="answers-container-${i}">
          <input type="radio" name="options" id="option${i + 1}" value= "${answer}" 
           required> 
          <label for="option${i + 1}"> ${answer}</label>
        </div>
      `;
      i++;
    });
    return answerOptions;
  }
//    Generates the HTML to display one question

  function generateAnswersList() {
    let currentQuestion = STORE.questions[STORE.currentQuestion];
    return `
      <form id="question-form" class="question-form">
            <div class="answers">
              ${generateanswerOptions()}
            </div>
          </div>
          <button type="submit" id="submit-answer-btn" >Submit</button>
          <button type="button" id="next-question-btn" > Next >></button>
      </form >
    `;
  }
  
//   Generates the HTML for the results screen
  
  function finalScreen() {
    return `
      <div class="results">
        <form id="js-restart-quiz">
          <fieldset>
            <div class="row">
              <div class="col-12">
                <legend>Great Job! Your Score is: ${STORE.score}/${STORE.questions.length}</legend>
              </div>
            </div>
          
            <div class="row">
              <div class="col-12">
                <button type="button" id="restart"> Restart Quiz </button>
              </div>
            </div>
          </fieldset>
      </form>
      </div>
    `;
  }
  
//   informs user with 'correct' or 'incorrect' as feedback and provides the correct answer if wrong.
  function generateFeedbackHTML(answerStatus) {
    let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
    let displayedAnswer = '';
    if (answerStatus === 'correct') {
        displayedAnswer = `
      <div class="right-answer">That is correct!</div>
      `;
    }
    else if (answerStatus === 'incorrect') {
        displayedAnswer = `
        <div class="wrong-answer">That is incorrect. The correct answer is ${correctAnswer}.</div>
      `;
    }
    return displayedAnswer;
  }
  
  /********** RENDER FUNCTION **********/
  // This function conditionally replaces the contents of the <main> tag based on the state of the store

  function render() {
    let html = '';
  
    if (STORE.quizStarted === false) {
      $('main').html(welcomeScreen());
      return;
    }
    else if (STORE.currentQuestion >= 0 && STORE.currentQuestion < STORE.questions.length) {
      html = questionNumber();
      html += generateAnswersList();
      $('main').html(html);
    }
    else {
      $('main').html(finalScreen());
    }
  }
  
  /********** EVENT HANDLER FUNCTIONS **********/
  // These functions handle events (submit, click, etc)

//    Handles click of the start button
   
  function handleStartClick() {
    $('main').on('click', '#begin', function (event) {
      STORE.quizStarted = true;
      render();
    });
  }
  
//     moves screen onto the next question  
  function handleNextQuestionClick() {
    $('body').on('click', '#next-question-btn', (event) => {
      render();
    });
  }

//      Handles the submission of the question form
  
  function handleFormSubmission() {
    $('body').on('submit', '#question-form', function (event) {
      event.preventDefault();
      const currentQuestion = STORE.questions[STORE.currentQuestion];
  
      // get value from checkbox checked by user
      let selectedOption = $('input[name=options]:checked').val();
      let optionContainerId = `#answers-container-${currentQuestion.answers.findIndex(i => i === selectedOption)}`;
  
      if (selectedOption === currentQuestion.correctAnswer) {
        STORE.score++;
        $(optionContainerId).append(generateFeedbackHTML('correct'));
      }
      else {
        $(optionContainerId).append(generateFeedbackHTML('incorrect'));
      }
      STORE.currentQuestion++;
      // hide the submit button
      $('#submit-answer-btn').hide();
      // disable all inputs
      $('input[type=radio]').each(() => {
        $('input[type=radio]').attr('disabled', true);
      });
      // show the next button
      $('#next-question-btn').show();
  
    });
  }
//    What to reset the quiz to on button submission

  function restartQuiz() {
    STORE.quizStarted = false;
    STORE.currentQuestion = 0;
    STORE.score = 0;
  }
  
  function handleRestartButtonClick() {
    $('body').on('click', '#restart', () => {
      restartQuiz();
      render();
    });
  }
  
  function handleQuizApp() {
    render();
    handleStartClick();
    handleNextQuestionClick();
    handleFormSubmission();
    handleRestartButtonClick();
  }
  
  $(handleQuizApp);