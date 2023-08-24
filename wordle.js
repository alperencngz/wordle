/* EVENT LISTENER */

const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");

/* GLOBAL CONSTANTS */
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

/* INIT FUNCTION */

async function init() {
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;
  setLoading(false);
  isLoading = false;

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

    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        word: currentGuess,
      }),
    });
    const resObj = await res.json();
    const isValidWord = resObj.validWord;
    // const {validWord} = resObj;

    setLoading(false);
    isLoading = false;

    if (!isValidWord) {
      markInvalidWord();
      return;
    }

    /* CONTROLLING THE LETTERS */
    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothing, handled above
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessParts[i]]--;
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;
    if (currentGuess === word) {
      document.querySelector(".brand").classList.add("winner");
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      alert(`You lose, the word was ${word}`);
      done = true;
    }

    currentGuess = "";
  };

  const backspace = () => {
    if (!(currentGuess.length = 0)) {
      console.log(currentGuess.substring(0, currentGuess.length - 1));

      currentGuess = currentGuess.substring(0, currentGuess.length - 1);

      letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
    }
  };

  const markInvalidWord = () => {
    // alert("Not a valid word");

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
    }

    setTimeout(function() {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
    }, 10);
  };

  /* INIT FUNCTION LOGIC TREE */

  document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
      return;
    }

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

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

init();
