// need to fix the counter as it should not add points when the cell is already clicked

const grid = document.querySelector('.saper-container');
const score = document.querySelector('.navi__move-counter');
const gameResult = document.querySelector('.navi__status');

let testMode = false; // if true, u'll see all mines
let gameOver = false;
let clickCounter = 0;

generateGrid();

//generate 10 by 10 grid
function generateGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    row = grid.insertRow(i);
    for (let j = 0; j < 10; j++) {
      cell = row.insertCell(j);
      cell.onclick = function () {
        clickCell(this);
      };

      // clear win/lose message
      let mine = document.createAttribute('data-mine');
      mine.value = 'false';
      cell.setAttributeNode(mine);
      gameResult.innerHTML = " ";
      gameOver = false;
    }
  }
  addMines();
  resetCounter();
};

// reset game
function resetCounter() {
  clickCounter = 0;
  score.innerHTML = clickCounter;
}

// add mines randomly
function addMines() {
  for (let i = 0; i < 25; i++) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    let cell = grid.rows[row].cells[col];
    cell.setAttribute('data-mine', 'true');
    if (testMode) {
      cell.innerHTML = 'X';
    }
  }
}

// highlight all mines in red
function revealMines() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = grid.rows[i].cells[j];
      if (cell.getAttribute('data-mine') == 'true') {
        cell.classList.add('cellMine');
      }
    }
  }
};

// add score
function checkLevelCompletion() {
  clickCounter = clickCounter + 1;
  score.innerHTML = clickCounter;
  let levelComplete = true;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((grid.rows[i].cells[j].getAttribute('data-mine') == 'false') && (grid.rows[i].cells[j].innerHTML == '')) {
        levelComplete = false;
      }
    }
  }

  if (levelComplete) {
    gameResult.innerHTML = 'Wygrana!';
    revealMines();
  }
};

// check if the end-user clicked on a mine
function clickCell(cell) {
  if (gameOver == false) {
    if (cell.getAttribute('data-mine') == 'true') {
      revealMines();
      gameResult.innerHTML = 'Przegrana!';
      gameOver = true;
      // count and display the number of adjacent mines
    } else {
      cell.classList.add('cellClicked');
      let mineCount = 0;
      let cellRow = cell.parentNode.rowIndex;
      let cellCol = cell.cellIndex;
      for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
        for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
          if (grid.rows[i].cells[j].getAttribute('data-mine') == 'true') mineCount++;
        }
      };

      // reveal all adjacent cells as they don't have a mine
      cell.innerHTML = mineCount;
      if (mineCount == 0) {
        for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
          for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
            // recursive Call
            if (grid.rows[i].cells[j].innerHTML == '') clickCell(grid.rows[i].cells[j]);
          }
        }
      }
      checkLevelCompletion();
    }
  }
};