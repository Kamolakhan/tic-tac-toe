const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

const Gameboard = (() => {
  let boardInternal = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => [...boardInternal];

  const placeMark = (index, mark) => {
    if (
      index >= 0 &&
      index < boardInternal.length &&
      boardInternal[index] === ""
    ) {
      boardInternal[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    boardInternal = ["", "", "", "", "", "", "", "", ""];
  };

  const isFull = () => boardInternal.every((cell) => cell !== "");

  return { getBoard, placeMark, resetBoard, isFull };
})();

const GameController = (() => {
  let playersList = [];
  let currentPlayerIdx;
  let gameIsOver;

  const winningCombinationsList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startGame = (player1Name, player2Name) => {
    playersList = [
      Player(player1Name || "Player 1", "🐙"),
      Player(player2Name || "Player 2", "🐡"),
    ];
    currentPlayerIdx = 0;
    gameIsOver = false;
    Gameboard.resetBoard();
    DisplayController.renderBoard();
    DisplayController.updateMessage(
      `${getCurrentPlayer().getName()}  ${getCurrentPlayer().getMark()}  turn`
    );
    console.log("Game started. Board reset.");
    console.log(
      `Player 1: ${playersList[0].getName()} (${playersList[0].getMark()})`
    );
    console.log(
      `Player 2: ${playersList[1].getName()} (${playersList[1].getMark()})`
    );
    console.log(`Current turn: ${playersList[currentPlayerIdx].getName()}`);
  };

  const getCurrentPlayer = () => playersList[currentPlayerIdx];

  const switchPlayer = () => {
    currentPlayerIdx = (currentPlayerIdx + 1) % playersList.length;
  };

  const checkWinCondition = (mark) => {
    const currentBoardState = Gameboard.getBoard();
    return winningCombinationsList.some((combination) => {
      return combination.every((index) => currentBoardState[index] === mark);
    });
  };

  const checkDrawCondition = () => {
    return (
      Gameboard.isFull() &&
      !checkWinCondition(playersList[0].getMark()) &&
      !checkWinCondition(playersList[1].getMark())
    );
  };

  const playTurn = (cellIndex) => {
    if (
      gameIsOver ||
      !Gameboard.placeMark(cellIndex, getCurrentPlayer().getMark())
    ) {
      console.log("Invalid move or game over.");
      return false;
    }

    console.log(
      `${getCurrentPlayer().getName()} placed ${getCurrentPlayer().getMark()} at ${cellIndex}`
    );
    DisplayController.renderBoard();

    if (checkWinCondition(getCurrentPlayer().getMark())) {
      gameIsOver = true;
      DisplayController.updateMessage(
        `Congratulations 🎉🎉🎉 ${getCurrentPlayer().getName()}!`
      );
      console.log(`Game Over. Winner: ${getCurrentPlayer().getName()}`);
      return true;
    }

    if (checkDrawCondition()) {
      gameIsOver = true;
      DisplayController.updateMessage("It's a draw!");
      console.log("Game Over. It's a draw.");
      return true;
    }

    switchPlayer();
    DisplayController.updateMessage(
      `${getCurrentPlayer().getName()}  ${getCurrentPlayer().getMark()}  turn`
    );
    console.log(`Next turn: ${getCurrentPlayer().getName()}`);
    return true;
  };

  const isGameOver = () => gameIsOver;

  const printBoardToConsole = () => {
    const currentBoard = Gameboard.getBoard();
    console.log(
      currentBoard[0] + "|" + currentBoard[1] + "|" + currentBoard[2]
    );
    console.log("-----");
    console.log(
      currentBoard[3] + "|" + currentBoard[4] + "|" + currentBoard[5]
    );
    console.log("-----");
    console.log(
      currentBoard[6] + "|" + currentBoard[7] + "|" + currentBoard[8]
    );
  };

  return {
    startGame,
    playTurn,
    getCurrentPlayer,
    isGameOver,
    printBoardToConsole,
  };
})();

const DisplayController = (() => {
  const gameboardDiv = document.getElementById("gameboard");
  const messageDiv = document.getElementById("message-area");
  const startBtn = document.getElementById("start-button");
  const restartBtn = document.getElementById("restart-button");
  const player1NameField = document.getElementById("player1-name");
  const player2NameField = document.getElementById("player2-name");
  const setupDiv = document.querySelector(".settings");
  const gameDiv = document.getElementById("game-area");

  const cellClickHandler = (event) => {
    if (!event.target.classList.contains("cell") || GameController.isGameOver())
      return;

    const cellIndex = parseInt(event.target.dataset.index);
    if (Gameboard.getBoard()[cellIndex] !== "") {
      console.log("Cell already taken.");
      return;
    }
    GameController.playTurn(cellIndex);
  };

  const renderBoard = () => {
    gameboardDiv.innerHTML = "";
    const currentBoard = Gameboard.getBoard();
    currentBoard.forEach((mark, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = index;
      cell.textContent = mark;
      if (mark === "🐙") cell.classList.add("x");
      if (mark === "🐡") cell.classList.add("o");
      cell.addEventListener("click", cellClickHandler);
      gameboardDiv.appendChild(cell);
    });
    console.log("Board rendered to DOM.");
  };

  const updateMessage = (text) => {
    messageDiv.textContent = text;
  };

  const startGameBtnHandler = () => {
    const player1Name = player1NameField.value.trim();
    const player2Name = player2NameField.value.trim();
    GameController.startGame(player1Name, player2Name);
    setupDiv.classList.add("hidden");
    gameDiv.classList.remove("hidden");
  };

  const restartGameBtnHandler = () => {
    gameDiv.classList.add("hidden");
    setupDiv.classList.remove("hidden");
  };

  startBtn.addEventListener("click", startGameBtnHandler);
  restartBtn.addEventListener("click", restartGameBtnHandler);

  gameDiv.classList.add("hidden");

  console.log("DisplayController initialized.");

  return { renderBoard, updateMessage };
})();
