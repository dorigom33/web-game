const gameBoard = document.querySelector('#game-board');
const selectionBox = document.querySelector('.selection-box');
const scoreDisplay = document.querySelector('#score');
const bestScoreDisplay = document.querySelector('#best-score');
const timerDisplay = document.querySelector('#timer');
const initialTime = 120; // 초기 제한 시간 (초)
const timerBar = document.querySelector('#timer-bar');
let timeRemaining = initialTime; // 현재 남은 시간 초기화

// 추가: 시작 버튼 클릭 이벤트 핸들러
document.querySelector('#gameover-container').style.display = 'none';
document.querySelector('#startButton').addEventListener('click', function () {
  // 오버레이 컨테이너를 숨깁니다.
  document.querySelector('#game-overlay-container').style.display = 'none';
  // 게임을 시작하는 함수 호출
  startGame();
});

let selectedCircles = [];
let isDragging = false;
let startX, startY;
let score = 0;
let bestScore = 0;

let gameTimer; // 타이머 변수

function getRandomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}

function updateScore(circlesNum) {
  score += circlesNum;
  console.log(`Score updated: ${score}`);
  const bestScoreElement = document.querySelector('#best-score');
  document.querySelector('#score').textContent = score;
  bestScore = bestScoreElement.textContent;
  // 베스트 스코어 업데이트
  if (score >= bestScore) {
    bestScoreElement.textContent = score;
  }
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${timeRemaining} sec`;

  // Progress bar 업데이트
  const progress = (timeRemaining / initialTime) * 100; // 타이머 진행 상태 계산
  timerBar.style.width = progress + '%'; // Progress bar의 너비 업데이트

  // 시간이 다 떨어졌을 때 게임 종료 처리
  if (timeRemaining <= 0) {
    clearInterval(gameTimer);
    document.querySelector('#gameover-container').style.display = '';
    document.querySelector('#myScore').textContent = `SCORE : ${score}`;
    // alert('Game Over! Your Score: ' + score);
  }
}

// 원을 클릭할 때 실행되는 이벤트 핸들러
function circleClickHandler(event) {
  const circle = event.target;
  const number = parseInt(circle.textContent, 10);

  if (number == 5) {
    return;
  }

  // 선택된 원을 배열에 추가하고 스타일 변경
  selectedCircles.push(circle);
  circle.classList.add('selected');

  // 선택된 원의 합을 계산
  let sum = 0;
  for (const selectedCircle of selectedCircles) {
    sum += parseInt(selectedCircle.textContent, 10);
  }

  // 합이 10이면 원을 숨김 처리
  if (sum === 10) {
    for (const selectedCircle of selectedCircles) {
      // 사라진 원 자리를 그대로 두기 위해 opacity를 0으로 설정
      selectedCircle.style.opacity = '0';
      selectedCircle.textContent = '0';
    }
    selectedCircles = []; // 선택된 원 배열 초기화
  }
}

// 마우스 다운 이벤트 핸들러
function mouseDownHandler(event) {
  startX = event.clientX;
  startY = event.clientY;

  // 네모 영역의 시작 위치 설정
  selectionBox.style.left = startX + 'px';
  selectionBox.style.top = startY + 'px';
  selectionBox.style.width = '0';
  selectionBox.style.height = '0';

  // 네모 영역을 보이도록 설정
  selectionBox.style.display = 'block';

  // 이벤트 리스너 등록
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);

  // 드래그 기능을 활성화
  isDragging = true;

  // 드래그 기능을 비활성화
  event.preventDefault();
}

// 마우스 이동 이벤트 핸들러
function mouseMoveHandler(event) {
  if (!isDragging) return;

  const currentX = event.clientX;
  const currentY = event.clientY;

  // 네모 영역의 크기 업데이트
  const width = currentX - startX;
  const height = currentY - startY;

  // 네모 영역의 위치와 크기 업데이트
  selectionBox.style.left = width >= 0 ? startX + 'px' : currentX + 'px';
  selectionBox.style.top = height >= 0 ? startY + 'px' : currentY + 'px';
  selectionBox.style.width = Math.abs(width) + 'px';
  selectionBox.style.height = Math.abs(height) + 'px';

  // 선택된 원에 테두리 스타일 추가
  const minX = Math.min(startX, currentX);
  const minY = Math.min(startY, currentY);
  const maxX = Math.max(startX, currentX);
  const maxY = Math.max(startY, currentY);

  const circles = document.querySelectorAll('.circle');

  circles.forEach((circle) => {
    const rect = circle.getBoundingClientRect();
    const circleX = rect.left + window.scrollX;
    const circleY = rect.top + window.scrollY;

    if (
      circleX + rect.width >= minX &&
      circleX <= maxX &&
      circleY + rect.height >= minY &&
      circleY <= maxY
    ) {
      // 합이 10일 때만 색상 변경
      const selectedSum = calculateSelectedSum();
      if (selectedSum === 10) {
        circle.style.backgroundImage = "url('/team1/imgs/frog-emoji.png')";
      } else {
        circle.style.backgroundImage = "url('/team1/imgs/frog-emoji.png')";
      }
    } else {
      circle.style.backgroundImage = "url('/team1/imgs/frog-emoji-s.png')";
    }
  });
}

// 합을 계산하는 함수
function calculateSelectedSum() {
  let sum = 0;
  for (const selectedCircle of selectedCircles) {
    sum += parseInt(selectedCircle.textContent, 10);
  }
  return sum;
}

// 마우스 업 이벤트 핸들러
function mouseUpHandler(event) {
  // 네모 영역을 숨김 처리
  selectionBox.style.display = 'none';

  // 선택된 원 찾기
  selectedCircles = [];
  const minX = parseInt(selectionBox.style.left);
  const minY = parseInt(selectionBox.style.top);
  const maxX = minX + parseInt(selectionBox.style.width);
  const maxY = minY + parseInt(selectionBox.style.height);

  const circles = document.querySelectorAll('.circle');

  circles.forEach((circle) => {
    const rect = circle.getBoundingClientRect();
    const circleX = rect.left + window.scrollX;
    const circleY = rect.top + window.scrollY;

    if (
      circleX + rect.width >= minX &&
      circleX <= maxX &&
      circleY + rect.height >= minY &&
      circleY <= maxY
    ) {
      selectedCircles.push(circle);
    }
  });

  // 선택된 원들의 합 계산
  let sum = 0;
  for (const selectedCircle of selectedCircles) {
    sum += parseInt(selectedCircle.textContent, 10);
  }

  // 합이 10이면 원을 숨김 처리하고 숫자를 0으로 설정
  if (sum === 10) {
    for (const selectedCircle of selectedCircles) {
      // 사라진 원 자리를 그대로 두기 위해 opacity를 0으로 설정
      selectedCircle.style.opacity = '0';
      selectedCircle.textContent = '0';
    }
    let circlesNum = selectedCircles.length;
    selectedCircles = []; // 선택된 원 배열 초기화
    updateScore(circlesNum); // 점수 업데이트
  }

  // 선택된 원들의 테두리 스타일 제거
  circles.forEach((circle) => {
    circle.style.border = 'none';
  });

  // 드래그 기능을 비활성화
  isDragging = false;

  // 이벤트 리스너 제거
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
}

for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 17; col++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.textContent = getRandomNumber(); // 랜덤한 숫자 설정

    // 원에 클릭 이벤트 핸들러 추가
    circle.addEventListener('click', circleClickHandler);

    // 원에 마우스 다운 이벤트 핸들러를 추가하여 네모 영역 생성
    circle.addEventListener('mousedown', mouseDownHandler);

    gameBoard.appendChild(circle);
  }
}

// 타이머 시작
gameTimer = setInterval(() => {
  // timeRemaining -= 1;
  updateTimer();
}, 1000);

// 게임 시작 함수
function startGame() {
  gameTimer = setInterval(() => {
    timeRemaining -= 1;
    updateTimer();
  }, 1000);
}
