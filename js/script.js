var colorsArray = [];
var chosenColor;
var buttons = document.querySelectorAll(".option-button");
var questionText = document.querySelector(".question-text");
var canClick = false;
var roundMaxTime = 15;
var timeAdd = 8;
var currentTime;
var buttonQty = 9;

var userObject = {
   correct_answers: 0,
   incorrect_answers: 0,
   max_lives: 5,
   current_lives: 0,
   highscore: 0,
};

document.addEventListener("DOMContentLoaded", main);

function main() {
   openModal("firstGame");
}
// play button
var playButtons = document.querySelectorAll(".play-button");

playButtons.forEach((button) => {
   button.addEventListener("click", () => {
      var difficulty = button.getAttribute("data-difficulty");

      if (difficulty == "easy") {
         buttonQty = 3;
      } else if (difficulty == "normal") {
         buttonQty = 6;
      } else if (difficulty == "hard") {
         buttonQty = 9;
      } else if (difficulty == "pro") {
         buttonQty = 12;
      }
      newGame();
   });
});

/* =================================================
                  GAME INIT
================================================== */
// new game
function newGame() {
   closeModal();
   reloadALL();
   initTracking();
   startTimer();
}

// load all
function reloadALL() {
   showAllButtons();
   generateRandomColors();
   selectColor();
   createButtons(buttonQty);

   canClick = true;
}

// generate random number utility
function generateRandomNumber(maxNum) {
   var randomNumber = Math.trunc(Math.random() * maxNum);

   return randomNumber;
}

// generate random colors and push to array
function generateRandomColors() {
   var numberOfColors = buttonQty;

   colorsArray.splice(0, buttonQty);
   for (i = 0; i < numberOfColors; i++) {
      var color1 = generateRandomNumber(255 + 1);
      var color2 = generateRandomNumber(255 + 1);
      var color3 = generateRandomNumber(255 + 1);
      var colorAsString = `rgb(${color1}, ${color2}, ${color3})`;

      colorsArray.push(colorAsString);
   }
}

// create buttons
function createButtons(num) {
   var buttonContainer = document.querySelector(".grid-container");
   var buttonsArray = buttonContainer.querySelectorAll(".option-button");

   buttonsArray.forEach((item) => {
      item.remove();
   });

   for (i = 0; i < num; i++) {
      var button = document.createElement("div");
      buttonContainer.appendChild(button);
      button.className = "option-button";
   }

   buttons = document.querySelectorAll(".option-button");
   updateUI();
   clickButtons();
}

// pick a random item from array
function selectColor() {
   chosenColor = colorsArray[generateRandomNumber(buttonQty)];
}

// update UI
function updateUI() {
   console.log(chosenColor);
   questionText.textContent = chosenColor;
   for (i = 0; i < buttons.length; i++) {
      buttons[i].style.backgroundColor = colorsArray[i];
   }
}

// on click match event.target color to selected item in array
function clickButtons() {
   for (var button of buttons) {
      button.addEventListener("click", (event) => {
         if (canClick) {
            var buttonColor = event.target.style.backgroundColor;

            if (buttonColor == chosenColor) {
               canClick = false;
               showCheckIcon(event);
               plusCorrect();
               setHighscore();
               resetTimer();

               setTimeout(() => {
                  reloadALL();
               }, 800);
            } else {
               plusIncorrect();
               removeLife();
               hideButton(event.target);
            }

            updateTrackingUI();
         }

         console.table(userObject);
      });
   }
}

// show check icon
function showCheckIcon(event) {
   var checkIcon = document.createElement("img");
   checkIcon.src = "./images/check-icon.svg";
   event.target.appendChild(checkIcon);

   setTimeout(() => {
      checkIcon.remove();
   }, 800);
}

// hide button
function hideButton(button) {
   button.classList.add("hide");
}

// show all buttons
function showAllButtons() {
   for (var button of buttons) {
      button.classList.remove("hide");
   }
}

/* =================================================
                  TRACKING
================================================== */

//initialize values
function initTracking() {
   userObject.correct_answers = 0;
   userObject.incorrect_answers = 0;
   userObject.current_lives = userObject.max_lives;
   updateTrackingUI();
}

//remove life
function removeLife() {
   userObject.current_lives -= 1;

   if (userObject.current_lives <= 0) {
      for (var button of buttons) {
         hideButton(button);
      }

      canClick = false;
      setTimeout(() => {
         gameOver("outOfLives");
      }, 2000);
   }
}

//plus correct
function plusCorrect() {
   userObject.correct_answers += 1;
}

// plus incorrect
function plusIncorrect() {
   userObject.incorrect_answers += 1;
}

// set highscore
function setHighscore() {
   if (userObject.correct_answers > userObject.highscore) {
      userObject.highscore = userObject.correct_answers;
   }
}

// update tracking UI
function updateTrackingUI() {
   var pointsText = document.querySelector(".points-text");
   var highscoreText = document.querySelector(".highscore-text");

   pointsText.textContent = `Points: ${userObject.correct_answers}`;
   highscoreText.textContent = `Personal Best: ${userObject.highscore}`;

   updateHearts();
}

// manage lives
function updateHearts() {
   var heartContainer = document.querySelector(".heart-container");
   var hearts = document.querySelectorAll(".heart");

   //remove all hearts
   for (var heart of hearts) {
      heart.remove();
   }

   // create hearts
   for (i = 0; i < userObject.current_lives; i++) {
      var newHeart = document.createElement("img");
      heartContainer.appendChild(newHeart);
      newHeart.className = "heart";
      newHeart.src = "./images/heart-icon.svg";
   }
}

// game over
function gameOver(type) {
   if (type == "outOfLives") {
      openModal("playAgain");
   } else if (type == "timeout") {
      openModal("timeout");
   }
}

/* =================================================
                  MODAL
================================================== */

function openModal(type) {
   var modal = document.querySelector(".dynamic-modal");
   var header = modal.querySelector(".header");
   var score = modal.querySelector(".score");
   var highscore = modal.querySelector(".highscore");

   if (type == "firstGame") {
      header.textContent = "New Game";
      // playButtonText.textContent = "Play";
   } else if (type == "playAgain") {
      header.textContent = "Out of lives";
      // playButtonText.textContent = "Play Again";
   } else if (type == "timeout") {
      header.textContent = "Timeout!";
      // playButtonText.textContent = "Play Again";
   }
   score.textContent = `You scored: ${userObject.correct_answers}`;
   highscore.textContent = `Personal best: ${userObject.highscore}`;

   modal.showModal();
}

function closeModal() {
   var modal = document.querySelector(".dynamic-modal");

   modal.close();
}

// timer
let gameTimer;
function startTimer() {
   var timerText = document.querySelector(".timer-text");
   currentTime = roundMaxTime + 1;

   clearTimeout(gameTimer);

   timerLoop();
   function timerLoop() {
      if (currentTime > 0) {
         gameTimer = setTimeout(() => {
            currentTime -= 1;
            timerText.textContent = `Time left: ${currentTime}`;
            timerLoop();
         }, 1000);
      } else if (currentTime <= 0) {
         clearTimeout(gameTimer);
         for (var button of buttons) {
            hideButton(button);
         }
         canClick = false;
         setTimeout(() => {
            gameOver("timeout");
            currentTime = roundMaxTime + 1;
         }, 2000);
      }
   }
}

function resetTimer() {
   // clearTimeout(gameTimer);
   currentTime += timeAdd;
   // startTimer();
}
