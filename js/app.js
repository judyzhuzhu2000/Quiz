import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = (() => {
    //cache the DOM
    const quizEl = document.querySelector(".jabquiz");
    const quizQuestionEl = document.querySelector(".jabquiz__question");
    const trackerEl = document.querySelector(".jabquiz__tracker");
    const taglineEl = document.querySelector(".jabquiz__tagline");
    const choicesEl = document.querySelector(".jabquiz__choices");
    const progressInnerEl = document.querySelector(".progress__inner");
    const nextButtonEl = document.querySelector(".next");
    const restartButtonEl = document.querySelector(".restart");



    const q1 = new Question(
        "Who is the first president of US?",
        ["Mike Jackson","Geroge Washinton","Bill Gates","Katherine linkton"],
        1
    );
    const q2 = new Question(
        "When Javascript has been created?",
        ["April 1970","May 1995","September 2001","October 2000"],
        1
    );

    const q3 = new Question(
        "What's CSS stands for?",
        ["Civil Service System","Constant System Sass","Cascading Style Sheets","Cascading Sexy Sheets"],
        2
    );
    const q4 = new Question(
        "What's HTML stands for? ",
        ["Hyper Text markup language","High Text markup language","Hyper many language","all above"],
        0
    );
    const q5 = new Question(
        "console.log(typeof[]) will return? ",
        ["Array","array","Null","Object"],
        3
    );

    //initialize quiz
    const quiz = new Quiz([q1,q2,q3,q4,q5]);

    const listeners = _ => {
        nextButtonEl.addEventListener("click", function() {
            const selectRadioElem = document.querySelector('input[name="choice"]:checked');
            if(selectRadioElem) {
                const key = Number(selectRadioElem.getAttribute("data-order"));
                quiz.guess(key);
                renderAll();
            }
        })

        restartButtonEl.addEventListener("click", function() {
            //reset the quiz
            quiz.reset();
            //render all
            renderAll();
            //restore the next button
            nextButtonEl.style.opacity = 1;
            //restor the tagline
            setValue(taglineEl, `Pick an option below!`);

        })
    }
    listeners();



    //create a variable to use innerHTML again and agin
    const setValue = (elem, value) => {
        elem.innerHTML = value;
    };

    const renderQuestion = _ => {
        //getCurrentQuestion().question to get question string not object
        const question = quiz.getCurrentQuestion().question;
        setValue(quizQuestionEl,question);
    };

    const renderTracker = _ => {
        const index = quiz.currentIndex;
        setValue(trackerEl,`${index+1} of ${quiz.questions.length}`);

    };

    const getPercentage =(num1, num2) => {
        return Math.round((num1/num2)*100);
    }

    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function() {
            if(width > maxPercent) {
                clearInterval(loadingBar);
            } else {
                width++;
                progressInnerEl.style.width = width + "%";
            }
        },3);
    }

    const renderProgress = _ => {
        //1.width
        const currentWidth =getPercentage(quiz.currentIndex, quiz.questions.length)
        //2.lauch(0,width)
        launch(0,currentWidth);
    }

    const renderChoicesElements = _ => {
        let markup = "";
        const currentChoices = quiz.getCurrentQuestion().choices;
        currentChoices.forEach((elem, index) => {
            markup += `
                <li class="jabquiz__choice">
                <input type="radio" name="choice" class="jabquiz__input" data-order=${index} id="choice${index}">
                <label for="choice${index}" class="jabquiz__label">
                    <i></i>
                    <span>${elem}</span>
                </label>
                </li>
            `
        })
        setValue(choicesEl,markup);
    }

    const renderEndScreen = _ => {
        setValue(quizQuestionEl, `Great Job!`);
        setValue(taglineEl, `Complete!`);
        setValue(trackerEl, `Your score ${getPercentage(quiz.score, quiz.questions.length)}%`);
        nextButtonEl.style.opacity = 0;
        renderProgress();
    }


    const renderAll = _ => {
        if(quiz.quizEnded()) {
            //render endScreen
            renderEndScreen();
        } else {
            //1. render the question
            renderQuestion();
            //2. render tracker
            renderTracker();
            //3. render progress
            renderProgress();
            //4. render choices elements
            renderChoicesElements();
        }
    }

    return {
        renderAll: renderAll
    }

})();
App.renderAll();

