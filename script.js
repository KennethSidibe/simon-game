
var computerStepsIndex = 0;
var level = 0;
var playerStepsIndex = 0;
var maxLevel = 10;

var redSound = new Audio("./sounds/red.mp3");
var yellowSound = new Audio("./sounds/yellow.mp3");
var greenSound = new Audio("./sounds/green.mp3");
var blueSound = new Audio("./sounds/blue.mp3");
var gameOverSound = new Audio("./sounds/wrong.mp3");
var victorySound = new Audio("./sounds/victory.wav");

var randNumber = 0;
var gameOn = false;

// setButtonSize();

var colorPattern = {
  0: "green",
  1: "red",
  2: "yellow",
  3: "blue",
};

var soundPattern = {
    'green': greenSound,
    'red': redSound,
    'yellow': yellowSound,
    'blue': blueSound,
};

var numberPattern = {
  'green': 0,
  'red': 1,
  'yellow': 2,
  'blue': 3,
};

var rgbPattern = {
    'rgb(0, 128, 0)': 'green',
    'rgb(255, 0, 0)': 'red',
    'rgb(255, 255, 0)': 'yellow',
    'rgb(0, 0, 255)': 'blue'
};

var sequence = Array(100)
    .fill(null)
    .map((item) => generateRandColor());

function setButtonSize() {

    var pixelWidthExpected = 200;
    var pixelHeightExpected = 200;
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    var boxWidthInVW = 100 * (200/vw);
    var boxHeightInVH = 100 * (200/vh);

    $('.box-pad').css('width', ""+boxWidthInVW +"vw ") = boxWidthInVW;
    $('.box-pad').css('height', ""+boxHeightInVH +"vh") = boxWidthInVW;

}


startGame();
generateRandColor();

function generateRandColor() {
  randNumber = Math.floor(Math.random() * 4);
  return colorPattern[randNumber];
  return 1;
}

function correctDoublesInColorSequence() {

    var previous = '';
    var current = '';
    var numberOfRepetitionsAllowed = 3;
    var counter = 0;

    for (let i = 0; i < sequence.length-1; i++) {

        previous = sequence[i];
        current = sequence[i+1];

        if(previous === current) {
            counter++;
        }

        if(counter == numberOfRepetitionsAllowed) {
            counter = 0;
            if (previous === current) {
                current = generateRandColor();
            }
            sequence[i] = current
        }
        previous = sequence[i];
        current
        
    }
}

function startGame() {
    correctDoublesInColorSequence();

    $(document).on("keydown", function (event) {
      if (!gameOn) {
        gameOn = true;
        if (event.key == "a") {
            $('h1').text("Level " + (level +1 )); 
            showButtonToBeClickedNow();
            makeButtonsListens();
        }
      }
    });
  
    $(document).on("keyup", function (event) {
      if (event.key == "a" || event.key == 'A') {
        gameOn = false;
      }
    });

}

function victory() {
    $('h1').text('Congratulations on Finishing The Simon Game ! 🎉 Press A to Replay');
    victorySound.play();
    playVictoryAnimation();
    gameOn = false;
    computerStepsIndex = 0;
    level = 0;
    playerStepsIndex = 0;
    resetGamePattern();
    
}

function hasPlayerFinishedGame() {

    console.log(level);

    if(level >= maxLevel) {
        return true;
    }
    
    return false;
}

function gameOver() {
    gameOn = false;
    computerStepsIndex = 0;
    level = 0;
    playerStepsIndex = 0;
    resetGamePattern();
}

function resetGamePattern() {
    sequence = Array(100)
    .fill(null)
    .map((item) => generateRandColor());
    correctDoublesInColorSequence();
}

function continueGame() {
    if(isLevelFinished()) {
        if(hasPlayerFinishedGame()) {
            victory();
        } else {
            level++;
            computerStepsIndex++;
            playerStepsIndex = 0;
            computerStepsIndex = 0;
            $('h1').text('Level ' + (level + 1));
            showButtonToBeClickedNow();
        }
    } else {
        playerStepsIndex++;
        computerStepsIndex++;
    }
}

function isLevelFinished() {
    return playerStepsIndex == level;
}
  
function gameBrainDecides(boxRGBValue) {
    var colorClicked = rgbPattern[boxRGBValue];
    if(hasPlayerLost(colorClicked)) {
        animateGameOver();
        gameOver();
    } else {
        setTimeout(() => {
            continueGame();    
        }, 300);
        
    }
}

function playCorrespondingSound(rgbValue) {
    var colorTriggered = rgbPattern[rgbValue];
    var audioToPlay = soundPattern[colorTriggered];

    audioToPlay.play();
}

function makeButtonsListens() {
    $(".box-pad").on("click", function () {
      var btnPressed = $(this);
      var rgbValue = btnPressed.css("background-color");
      
      playCorrespondingSound(rgbValue);
      animatePlayerBtnPressed(btnPressed);
      
      gameBrainDecides(rgbValue);
    });
}

function hasPlayerLost(colorClicked) {

    var currentColorInSequence = sequence[computerStepsIndex];

    if (colorClicked != currentColorInSequence) {
        return true;
    }

    return false;

}

// VIEWS METHODS

function playVictoryAnimation() {
    flashButtons();

    flashBackgroundColor();
}


function flashButtons(){

    increment = 0;
    timeOut = 800;

    for (let i = 0; i < 2; i++) {
        // green
        setTimeout(() => {
            $('.green').addClass('pressed'); 
        }, 0+increment);
        
        // green
        setTimeout(() => {
            $('.green').removeClass('pressed'); 
        }, 100+increment);

        
        // red
        setTimeout(() => {
            $('.red').addClass('pressed');
        }, 200+increment);

        // red
        setTimeout(() => {
            $('.red').removeClass('pressed'); 
        }, 300+increment);


        // yellow
        setTimeout(() => {
            $('.yellow').addClass('pressed');
        }, 400+increment);

        // yellow
        setTimeout(() => {
            $('.yellow').removeClass('pressed');
        }, 500+increment);

        // blue
        setTimeout(() => {
            $('.blue').addClass('pressed');
        }, 600+increment);

        // blue
        setTimeout(() => {
            $('.blue').removeClass('pressed');
        }, 700+increment);
        increment +=timeOut;
    }

    
}

function flashBackgroundColor() {

    for (let i = 0; i < 5; i++) {

        timeOut = 100 + (i * 200);

        setTimeout(() => {
            $('body').addClass('victory');
        }, timeOut);

        setTimeout(() => {
            $('body').removeClass('victory');
        }, timeOut+100);
        
    }

}

function animateGameOver() {

    $('body').addClass('game-over');
    gameOverSound.play();

    setTimeout(() => {
        $('body').removeClass('game-over');
    }, 100);

    $('h1').text('Game Over, Press A to Restart');

}

function animatePlayerBtnPressed(btnPressed) {

    var btnColor = rgbPattern[btnPressed.css('background-color')]; 
    var soundToPlay = soundPattern[btnColor];
    btnPressed.addClass('pressed');

    setTimeout(() => {
        btnPressed.removeClass('pressed');

    }, 100);

}


function animateComputerBtnToBeClicked(color) {
  
    var soundToPlay = soundPattern[color];
    var timeOut = 100;
  
    soundToPlay.play();
    $("." + color)
      .fadeIn(timeOut)
      .fadeOut(timeOut)
      .fadeIn(timeOut);
  }

function showButtonToBeClickedNow() {

    var colorNow = sequence[level];
    
    animateComputerBtnToBeClicked(colorNow);
}

