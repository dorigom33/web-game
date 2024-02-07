// 3 x 3, 4 x 4, 5 x 5 하나로 합친 스크립트
console.log('GRID_SIZE:', GRID_SIZE);

let grid;

let score = 0;
let bestScore;

// 게임 보드를 가져옴
const gameContainer = document.querySelector('#game-container-' + GRID_SIZE);

function initializeGrid() {
  grid = Array.from({ length: GRID_SIZE }, () =>
    Array(parseInt(GRID_SIZE)).fill(0)
  );
  addRandomTile();
  addRandomTile();
  updateGrid();
}

// 랜덤 위치에 랜덤 값을 가진 칸 추가
function addRandomTile() {
  const emptyCells = findEmptyCells();

  // 빈 셀이 있을 경우 랜덤한 칸을 선택하여 값을 추가
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const newValue = Math.random() < 0.6 ? 2 : 4;
    grid[randomCell.row][randomCell.col] = newValue;
  }
}

// 빈 셀 찾아서 배열 만드는 함수 (게임 오버 처리에도 쓰여서 함수로 만들었습니다.)
function findEmptyCells() {
  const emptyCells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  return emptyCells;
}

function updateGrid() {
  gameContainer.innerHTML = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const value = grid[i][j];
      const tile = document.createElement('div');
      tile.classList.add('tile' + GRID_SIZE, `tile-${value}`);
      if (value !== 0) {
        tile.textContent = value;
      }
      gameContainer.appendChild(tile);
    }
  }
}

function combine(row) {
  const combinedRow = [];
  let i = 0;
  let combinedValue = 0; // 합쳐진 값 초기화

  while (i < row.length) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      combinedValue = row[i] * 2; // 합쳐진 값을 계산
      combinedRow.push(combinedValue);
      i += 2;
    } else {
      combinedRow.push(row[i]);
      i++;
    }
  }
  while (combinedRow.length < GRID_SIZE) {
    combinedRow.push(0);
  }

  return { row: combinedRow, value: combinedValue }; // 합쳐진 값 반환
}

function move(rowOrColumn, direction) {
  const nonEmptyValues = rowOrColumn.filter((val) => val !== 0);
  const { row: combinedRow, value: combinedValue } = combine(nonEmptyValues); // combine 함수의 반환값 사용
  const emptyCount = GRID_SIZE - combinedRow.length;

  const newValues =
    direction === 'right' || direction === 'down'
      ? [...Array(emptyCount).fill(0), ...combinedRow]
      : [...combinedRow, ...Array(emptyCount).fill(0)];

  // 점수 계산과 업데이트
  if (combinedValue > 0) {
    score += combinedValue; // 합쳐진 값으로 스코어 업데이트
    updateScore();
  }

  return newValues;
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < GRID_SIZE; i++) {
    const newRow = move(grid[i], 'left');
    if (!arraysEqual(grid[i], newRow)) {
      moved = true;
    }
    grid[i] = newRow;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let i = 0; i < GRID_SIZE; i++) {
    const newRow = move(grid[i].slice().reverse(), 'right');
    newRow.reverse();
    if (!arraysEqual(grid[i], newRow)) {
      moved = true;
    }
    grid[i] = newRow;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let j = 0; j < GRID_SIZE; j++) {
    const newColumn = move(
      grid.map((row) => row[j]),
      'up'
    );
    if (
      !arraysEqual(
        grid.map((row) => row[j]),
        newColumn
      )
    ) {
      moved = true;
    }
    for (let i = 0; i < GRID_SIZE; i++) {
      grid[i][j] = newColumn[i];
    }
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let j = 0; j < GRID_SIZE; j++) {
    const newColumn = move(grid.map((row) => row[j]).reverse(), 'down');
    for (let i = 0; i < GRID_SIZE; i++) {
      grid[i][j] = newColumn[GRID_SIZE - 1 - i];
    }
    if (
      !arraysEqual(
        grid.map((row) => row[j]),
        newColumn
      )
    ) {
      moved = true;
    }
  }
  return moved;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function isMovePossible() {
  let movePossible = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        movePossible = true;
        break;
      }
      if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) {
        movePossible = true;
        break;
      }
      if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) {
        movePossible = true;
        break;
      }
    }
    if (movePossible) {
      break;
    }
  }
  return movePossible;
}

document.addEventListener('keydown', (event) => {
  let moved = false;
  const canMove = isMovePossible();
  switch (event.key) {
    case 'ArrowLeft':
      moved = moveLeft();
      break;
    case 'ArrowRight':
      moved = moveRight();
      break;
    case 'ArrowUp':
      moved = moveUp();
      break;
    case 'ArrowDown':
      moved = moveDown();
      break;
  }

  if (canMove && moved) {
    console.log('잘 움직임!');
    addRandomTile();
    updateGrid();
    if (isGameOver()) {
      alert('Game Over!');
      handleGameOver(); // userScore 인자 제거
    }
  }
});

function updateScore() {
  const bestScoreElement = document.querySelector('#best-score');
  document.querySelector('#score').textContent = score;
  bestScore = bestScoreElement.textContent;
  if(score >= bestScore){
    bestScoreElement.textContent = score;
  }
}

// 게임 종료인지 확인
function isGameOver() {
  // 빈 셀인 경우 인접한 타일과 비교
  if (findEmptyCells().length === 0) {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const value = grid[i][j];
        // 오른쪽 비교
        if (j < GRID_SIZE - 1 && grid[i][j + 1] === value) {
          return false;
        }
        // 왼쪽 비교
        if (j > 0 && grid[i][j - 1] === value) {
          return false;
        }
        // 위쪽 비교
        if (i > 0 && grid[i - 1][j] === value) {
          return false;
        }
        // 아래쪽 비교
        if (i < GRID_SIZE - 1 && grid[i + 1][j] === value) {
          return false;
        }
      }
    }
    return true;
  }
}

// 게임 종료 처리
function handleGameOver() {
  // console.log('게임 오버! 정보 저장 완료');
  // 리더보드 페이지로 이동
  savePoint();
  alert('게임 오버, 리더보드로 이동합니다...');
  window.location.href = '../leaderboard/board.html';
}

// 게임 초기화
initializeGrid();
