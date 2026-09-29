/* =====================================================
   QUIZ APPLICATION javascript part 
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

const startScreen = document.getElementById("startScreen");

const quizScreen = document.getElementById("quizScreen");

const resultScreen = document.getElementById("resultScreen");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");

const errorText = document.getElementById("errorText");


/* Start screen */

const category = document.getElementById("category");

const difficulty = document.getElementById("difficulty");

const questionCount =
    document.getElementById("questionCount");

const startBtn =
    document.getElementById("startBtn");


/* Quiz */

const questionNumber =
    document.getElementById("questionNumber");

const timerElement =
    document.getElementById("timer");

const progressBar =
    document.getElementById("progressBar");

const questionElement =
    document.getElementById("question");

const optionsContainer =
    document.getElementById("options");

const difficultyBadge =
    document.getElementById("difficultyBadge");

const reviewBtn =
    document.getElementById("reviewBtn");

const reviewStatus =
    document.getElementById("reviewStatus");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");


/* Result */

const finalScore =
    document.getElementById("finalScore");

const correctCount =
    document.getElementById("correctCount");

const wrongCount =
    document.getElementById("wrongCount");

const percentage =
    document.getElementById("percentage");

const resultMessage =
    document.getElementById("resultMessage");

const restartBtn =
    document.getElementById("restartBtn");

const homeBtn =
    document.getElementById("homeBtn");

const leaderboard =
    document.getElementById("leaderboard");

const resultLeaderboard =
    document.getElementById("resultLeaderboard");


/* Theme */

const themeBtn =
    document.getElementById("themeBtn");


/* Error */

const errorHomeBtn =
    document.getElementById("errorHomeBtn");


/* =====================================================
   QUIZ VARIABLES
===================================================== */

let questions = [];

let currentQuestion = 0;

let userAnswers = [];

let reviewQuestions = [];

let score = 0;

let timeLeft = 30;

let timer;


/* =====================================================
   CONSTANTS
===================================================== */

const QUESTION_TIME = 30;

const LEADERBOARD_KEY =
    "quizLeaderboard";


/* =====================================================
   EVENT LISTENERS
===================================================== */

startBtn.addEventListener(
    "click",
    startQuiz
);


previousBtn.addEventListener(
    "click",
    showPreviousQuestion
);


nextBtn.addEventListener(
    "click",
    showNextQuestion
);


reviewBtn.addEventListener(
    "click",
    toggleReview
);


restartBtn.addEventListener(
    "click",
    restartQuiz
);


homeBtn.addEventListener(
    "click",
    goHome
);


errorHomeBtn.addEventListener(
    "click",
    goHome
);


themeBtn.addEventListener(
    "click",
    toggleTheme
);


/* =====================================================
   START QUIZ
===================================================== */

async function startQuiz() {

    /*
        Reset old quiz data
    */

    questions = [];

    currentQuestion = 0;

    userAnswers = [];

    reviewQuestions = [];

    score = 0;


    /*
        Get values from the form
    */

    const selectedCategory =
        category.value;

    const selectedDifficulty =
        difficulty.value;

    const amount =
        questionCount.value;


    /*
        Build API URL
    */

    let apiURL =
        `https://opentdb.com/api.php?amount=${amount}&type=multiple`;


    /*
        Add category only if user
        selected a category.
    */

    if (selectedCategory !== "0") {

        apiURL +=
            `&category=${selectedCategory}`;
    }


    /*
        Add difficulty only if
        user selected one.
    */

    if (selectedDifficulty !== "any") {

        apiURL +=
            `&difficulty=${selectedDifficulty}`;
    }


    /*
        Show loading screen
    */

    showLoading();


    try {

        /*
            Fetch data from API
        */

        const response =
            await fetch(apiURL);


        /*
            Check if HTTP request failed
        */

        if (!response.ok) {

            throw new Error(
                "Unable to fetch quiz questions."
            );
        }


        /*
            Convert response to JSON
        */

        const data =
            await response.json();


        /*
            Open Trivia DB uses response_code.
            0 means successful.
        */

        if (data.response_code !== 0) {

            throw new Error(
                "Not enough questions available for these settings."
            );
        }


        /*
            Store questions
        */

        questions =
            data.results;


        /*
            Create arrays for answers
        */

        userAnswers =
            new Array(questions.length).fill(null);

        reviewQuestions =
            new Array(questions.length).fill(false);


        /*
            Hide loading
        */

        hideLoading();


        /*
            Show quiz screen
        */

        startScreen.classList.add("hidden");

        quizScreen.classList.remove("hidden");

        resultScreen.classList.add("hidden");


        /*
            Display first question
        */

        displayQuestion();


    } catch (error) {

        /*
            Error handling
        */

        hideLoading();

        showError(error.message);
    }
}


/* =====================================================
   DISPLAY QUESTION
===================================================== */

function displayQuestion() {

    const current =
        questions[currentQuestion];


    /*
        Decode HTML entities.

        Open Trivia DB sometimes returns:

        &quot;
        &amp;
        &#039;

        etc.
    */

    const questionText =
        decodeHTML(current.question);


    const correctAnswer =
        decodeHTML(current.correct_answer);


    /*
        Update question number
    */

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;


    /*
        Update progress bar
    */

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width =
        `${progress}%`;


    /*
        Update difficulty
    */

    difficultyBadge.textContent =
        current.difficulty;


    /*
        Update question
    */

    questionElement.textContent =
        questionText;


    /*
        Generate options
    */

    createOptions(current);


    /*
        Update review button
    */

    updateReviewButton();


    /*
        Previous button
    */

    if (currentQuestion === 0) {

        previousBtn.disabled = true;

        previousBtn.style.opacity = "0.5";

    } else {

        previousBtn.disabled = false;

        previousBtn.style.opacity = "1";
    }


    /*
        Next button text
    */

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextBtn.textContent =
            "Finish Quiz ✓";

    } else {

        nextBtn.textContent =
            "Next →";
    }


    /*
        Start timer
    */

    startTimer();
}


/* =====================================================
   CREATE OPTIONS
===================================================== */

function createOptions(question) {

    /*
        Clear previous options
    */

    optionsContainer.innerHTML = "";


    /*
        Create array containing
        correct + incorrect answers
    */

    const answers = [

        question.correct_answer,

        ...question.incorrect_answers

    ];


    /*
        Randomize answers
    */

    shuffleArray(answers);


    /*
        Create HTML element
        for every answer
    */

    answers.forEach(answer => {

        const option =
            document.createElement("div");


        option.classList.add("option");


        /*
            Decode API HTML entities
        */

        option.textContent =
            decodeHTML(answer);


        /*
            Store original answer
            inside dataset
        */

        option.dataset.answer =
            answer;


        /*
            Check whether this option
            was previously selected.
        */

        if (
            userAnswers[currentQuestion] ===
            answer
        ) {

            option.classList.add(
                "selected"
            );
        }


        /*
            Add click event
        */

        option.addEventListener(
            "click",
            () => selectAnswer(answer)
        );


        optionsContainer.appendChild(
            option
        );

    });
}


/* =====================================================
   SELECT ANSWER
===================================================== */

function selectAnswer(answer) {

    /*
        Store user's answer
    */

    userAnswers[currentQuestion] =
        answer;


    /*
        Update UI
    */

    const allOptions =
        document.querySelectorAll(".option");


    allOptions.forEach(option => {

        option.classList.remove(
            "selected"
        );


        if (
            option.dataset.answer ===
            answer
        ) {

            option.classList.add(
                "selected"
            );
        }

    });
}


/* =====================================================
   NEXT QUESTION
===================================================== */

function showNextQuestion() {

    /*
        If this is the final question,
        finish the quiz.
    */

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        finishQuiz();

        return;
    }


    currentQuestion++;

    displayQuestion();
}


/* =====================================================
   PREVIOUS QUESTION
===================================================== */

function showPreviousQuestion() {

    if (currentQuestion === 0) {

        return;
    }


    currentQuestion--;

    displayQuestion();
}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    /*
        Stop previous timer
    */

    clearInterval(timer);


    /*
        Reset timer
    */

    timeLeft =
        QUESTION_TIME;


    timerElement.textContent =
        timeLeft;


    /*
        Start countdown
    */

    timer = setInterval(() => {

        timeLeft--;

        timerElement.textContent =
            timeLeft;


        /*
            Time is over
        */

        if (timeLeft <= 0) {

            clearInterval(timer);


            /*
                Automatically move
                to next question
            */

            if (
                currentQuestion ===
                questions.length - 1
            ) {

                finishQuiz();

            } else {

                currentQuestion++;

                displayQuestion();
            }

        }

    }, 1000);
}


/* =====================================================
   MARK FOR REVIEW
===================================================== */

function toggleReview() {

    /*
        Toggle true/false
    */

    reviewQuestions[currentQuestion] =
        !reviewQuestions[currentQuestion];


    updateReviewButton();
}


/* =====================================================
   UPDATE REVIEW BUTTON
===================================================== */

function updateReviewButton() {

    if (
        reviewQuestions[currentQuestion]
    ) {

        reviewBtn.textContent =
            "★ Marked for Review";

        reviewBtn.classList.add(
            "marked"
        );

        reviewStatus.textContent =
            "⚠ Marked for review";

    } else {

        reviewBtn.textContent =
            "☆ Mark for Review";

        reviewBtn.classList.remove(
            "marked"
        );

        reviewStatus.textContent =
            "";
    }
}


/* =====================================================
   FINISH QUIZ
===================================================== */

function finishQuiz() {

    clearInterval(timer);


    /*
        Calculate score
    */

    score = 0;


    questions.forEach(
        (question, index) => {

            if (
                userAnswers[index] ===
                question.correct_answer
            ) {

                score++;
            }

        }
    );


    /*
        Calculate statistics
    */

    const total =
        questions.length;

    const wrong =
        total - score;

    const percent =
        Math.round(
            (score / total) * 100
        );


    /*
        Update result screen
    */

    finalScore.textContent =
        `${score} / ${total}`;

    correctCount.textContent =
        score;

    wrongCount.textContent =
        wrong;

    percentage.textContent =
        `${percent}%`;


    /*
        Result message
    */

    if (percent === 100) {

        resultMessage.textContent =
            "Perfect score! Outstanding! 🎉";

    } else if (percent >= 80) {

        resultMessage.textContent =
            "Excellent work! 🔥";

    } else if (percent >= 60) {

        resultMessage.textContent =
            "Good job! Keep improving! 👍";

    } else if (percent >= 40) {

        resultMessage.textContent =
            "Not bad! A little more practice! 💪";

    } else {

        resultMessage.textContent =
            "Keep practicing. You can do better! 📚";
    }


    /*
        Save score to localStorage
    */

    saveScore(score, total);


    /*
        Display leaderboard
    */

    displayLeaderboard(
        resultLeaderboard
    );


    /*
        Change screens
    */

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    startScreen.classList.add("hidden");
}


/* =====================================================
   SAVE SCORE
===================================================== */

function saveScore(score, total) {

    /*
        Get existing leaderboard
    */

    let scores =
        JSON.parse(
            localStorage.getItem(
                LEADERBOARD_KEY
            )
        ) || [];


    /*
        Create score object
    */

    const newScore = {

        score: score,

        total: total,

        percentage:
            Math.round(
                (score / total) * 100
            ),

        date:
            new Date().toLocaleDateString()

    };


    /*
        Add new score
    */

    scores.push(newScore);


    /*
        Sort highest percentage first
    */

    scores.sort(
        (a, b) =>
            b.percentage -
            a.percentage
    );


    /*
        Keep only top 10
    */

    scores =
        scores.slice(0, 10);


    /*
        Save back to localStorage
    */

    localStorage.setItem(
        LEADERBOARD_KEY,
        JSON.stringify(scores)
    );
}


/* =====================================================
   DISPLAY LEADERBOARD
===================================================== */

function displayLeaderboard(container) {

    /*
        Get scores
    */

    const scores =
        JSON.parse(
            localStorage.getItem(
                LEADERBOARD_KEY
            )
        ) || [];


    /*
        Clear container
    */

    container.innerHTML = "";


    /*
        No scores
    */

    if (scores.length === 0) {

        container.innerHTML = `
            <p class="no-score">
                No scores yet. Take your first quiz!
            </p>
        `;

        return;
    }


    /*
        Create leaderboard
    */

    scores.forEach(
        (item, index) => {

            const row =
                document.createElement("div");


            row.classList.add(
                "leaderboard-item"
            );


            row.innerHTML = `

                <span class="rank">
                    #${index + 1}
                </span>

                <span>
                    ${item.score}/${item.total}
                </span>

                <span class="score">
                    ${item.percentage}%
                </span>

                <span>
                    ${item.date}
                </span>

            `;


            container.appendChild(row);

        }
    );
}


/* =====================================================
   RESTART QUIZ
===================================================== */

function restartQuiz() {

    /*
        Start another quiz using
        the same settings.
    */

    resultScreen.classList.add(
        "hidden"
    );

    startQuiz();
}


/* =====================================================
   GO HOME
===================================================== */

function goHome() {

    clearInterval(timer);


    /*
        Reset screens
    */

    quizScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

    startScreen.classList.remove(
        "hidden"
    );


    /*
        Show leaderboard
    */

    displayLeaderboard(
        leaderboard
    );
}


/* =====================================================
   SHUFFLE ARRAY
===================================================== */

function shuffleArray(array) {

    /*
        Fisher-Yates shuffle
    */

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];
    }
}


/* =====================================================
   DECODE HTML
===================================================== */

function decodeHTML(text) {

    const textarea =
        document.createElement("textarea");


    textarea.innerHTML =
        text;


    return textarea.value;
}


/* =====================================================
   LOADING
===================================================== */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );
}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );
}


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    errorText.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );
}


/* =====================================================
   DARK MODE
===================================================== */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    /*
        Save theme preference
    */

    localStorage.setItem(
        "quizTheme",
        isDark ? "dark" : "light"
    );


    /*
        Change button text
    */

    if (isDark) {

        themeBtn.textContent =
            "☀️ Light Mode";

    } else {

        themeBtn.textContent =
            "🌙 Dark Mode";
    }
}


/* =====================================================
   LOAD SAVED THEME
===================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "quizTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️ Light Mode";
    }
}


/* =====================================================
   INITIALIZE APPLICATION
===================================================== */

function initializeApp() {

    /*
        Load dark/light mode
    */

    loadTheme();


    /*
        Load leaderboard
    */

    displayLeaderboard(
        leaderboard
    );
}


/*
    Start application
*/

initializeApp();