/* EVENT LISTENER */

const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");

/* GLOBAL CONSTANTS */
const ANSWER_LENGTH = 5;

/* INIT FUNCTION */

async function init() {
  let currentGuess = "";
  let currentRow = 0;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  setLoading(false);

  /* LOGIC FUNCTIONS */

  const addLetter = (letter) => {
    console.log(currentGuess.length);
    console.log(letter);

    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText =
      letter;
  };

  const commit = async () => {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }

    /* CONTROLLING THE LETTERS */

    const correctWord = word;
    const correctLetters = correctWord.split("");

    if (currentGuess === correctWord) {
      const header = document.querySelector(".brand");
      header.classList.add("winner");
    }

    /* 
    This way I cleared my array of correctLetters from the letters that are 
    guessed correctly, so in the next for loop I won't have the problem of marking
    wrong guesses as correct for the reason of close guess appearing before the
    correct guess. 
    As an example, in previous way if our correct word is PHOTO and we put OHOTO,
    the first o would be marked as close eventhough it shouldn't.
    */
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      const guessLetter = currentGuess[i];
      const correctLetter = correctWord[i];
      if (correctLetter === guessLetter) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        const index = correctLetters.indexOf(guessLetter);
        correctLetters[index] = " ";
        isCorrect = true;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      let isCorrect = false;
      let isClose = false;
      const guessLetter = currentGuess[i];
      const correctLetter = correctWord[i];

      if (correctLetter === guessLetter) {
        isCorrect = true;
      }

      if (correctLetters.includes(guessLetter) && !isCorrect) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        const index = correctLetters.indexOf(guessLetter);
        correctLetters[index] = " ";
        isClose = true;
      }

      if (!isClose && !isCorrect) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;
    currentGuess = "";
  };

  const backspace = () => {
    if (!(currentGuess.length = 0)) {
      console.log(currentGuess.substring(0, currentGuess.length - 1));

      currentGuess = currentGuess.substring(0, currentGuess.length - 1);

      letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
    }
  };

  /* INIT FUNCTION LOGIC TREE */

  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }

    return;
  });
}

const isLetter = (letter) => {
  return /^[a-zA-Z]$/.test(letter);
};

const setLoading = (isLoading) => {
  loadingDiv.classList.toggle("hidden", !isLoading);
};

init();
