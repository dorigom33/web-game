const rows = 10; //행 개수
const cols = 12; //열 개수

const block_width = 87; //블럭 가로길이
const block_height = 20; // 블럭 세로길이
let scoreTitle = document.querySelector("#score"); // 스코어 html
const Board = []; //배열 초기화
let stage = 1; //스테이지 번호
let remains = 0; // 남아있는 블럭 체크용 변수
let chooseImage = new Image(); // 이미지 객채 생성

//이미지 로딩을위한 한번대입
chooseImage = item1;
chooseImage = item2;
chooseImage = item3;
chooseImage = item4;
const imageUrls = [
  "/team5/img/item1.png",
  "/team5/img/item2.png",
  "/team5/img/item3.png",
  "/team5/img/item4.png"
];
let randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
let longPaddleItemTimeOutId;
let PowerballItemTimeOutId;
let stickyPaddleItemTimeOutId;


let isEatStickItem = false; // 접착 아이템 먹었는지

//---------------------------------------변수 선언은 위에다 하는게좋아요.. 그때그때 생성해버리면 보기 어지러워요..-----------------------------
//-------------------------------------------------------------함수---------어차피 윈도우 로드이벤트라 그냥 순서막놔도됨 function먼저 읽으니까!------------------------------------------


// 20초후에 패들길이가 원래대로 돌아오게하는것
function longPaddleItemTimeOut() {
  longPaddleItemTimeOutId = setTimeout(function () {
    paddleWidth = 150;
    ctx.clearRect(0, y - 100, 1080, canvas.height - paddleHeight);
    drawPaddle();
  }, 20000);
}

// 10초후에 블럭 마구잡이로 부수는거 원래대로 돌아오게함
function PowerballItemTimeOut() {
  PowerballItemTimeOutId = setTimeout(function () {
    isGetItem2 = false;
    ctx.clearRect(0, y - 100, 1080, canvas.height - paddleHeight);
    drawBall();
    drawPaddle();
  }, 10000);
}

function stickyPaddleItemTimeOut() {
  stickyPaddleItemTimeOutId = setTimeout(function() {
    isEatStickItem = false;
  }, 10000);
}


// 아이템 그리는 함수
function animateItem(x, y, Url) { //이거 매개변수를 자꾸 Undifined 로 받아서 강제로 접목시킴ㅋㅋㅋㅋㅋㅋㅋ 찾아보니까 자바스크립트 특성이래요
  //이거 계산이 패들 세로길이 + 패들위치 이렇게하면되요
  if (Url == '/team5/img/item1.png') { //목숨증가 아이템
    chooseImage = item1;
  } else if (Url == '/team5/img/item2.png') { //파워 아이템
    chooseImage = item2;
  } else if (Url == '/team5/img/item3.png') { //패들길어지는 아이템
    chooseImage = item3;
  } else if (Url == '/team5/img/item4.png') { // 접착아이템
    chooseImage = item4;
  }
  const paddleY = canvas.height - paddleHeight - 100;
  if (y <= canvas.height) {
    ctx.clearRect(x, y, chooseImage.width, chooseImage.height);
  }
  // 캔버스 높이에서 떨어지면
  y += 5; //이미지 내려가는 속도 조절할 수 있음

  ctx.drawImage(chooseImage, x + (block_width / 2), y);//이미지 그리는 위치
  if (
    x < paddleXPosition + paddleWidth && //?
    x + chooseImage.width > paddleXPosition &&
    y + chooseImage.height >= paddleY && // 아이템을 먹었을때 이미지 사라지는거 수정
    y < paddleY + paddleHeight
  ) {
    scoreTitle.textContent = parseInt(scoreTitle.textContent) + 50;
    ctx.clearRect(x, y - 5, chooseImage.width, chooseImage.height); // 이미지를 충돌 시 지움.
    player.play(eat_item);//효과음재생
    console.log(Url);
    //먹은 아이템에 대해서
    if (Url == '/team5/img/item1.png') { //목숨증가 아이템
      life++; // 목숨증가
      life_html = ''; //새로써야겠지?
      for (let i = 0; i < life; i++) {
        life_html += '<img src="/team5/img/ball.png" alt="공"></img>';
      }
      document.querySelector('#lives').innerHTML = life_html; //목숨개수를 새로쓴다.
    } else if (Url == '/team5/img/item2.png') { //파워 아이템
      isGetItem2 = true;
      clearTimeout(PowerballItemTimeOutId);
      PowerballItemTimeOut();
    } else if (Url == '/team5/img/item3.png') { //패들길어지는 아이템
      paddleWidth = 200;
      clearTimeout(longPaddleItemTimeOutId);
      longPaddleItemTimeOut();
    } else if (Url == '/team5/img/item4.png') { // 접착아이템
      isEatStickItem = true;
      clearTimeout(stickyPaddleItemTimeOutId);
      stickyPaddleItemTimeOut();
    }
  } else if (!isBallfloor) { //공안떨어졌으면 이르케그림
    requestAnimationFrame(() => animateItem(x, y + 1, Url)); // 나는 화살표함수모르는데.. -> 여기 animateItem 마지막 매개변수 일부러 안넣은건지 뭔지 모르겠는데 넣으니까 위에 Url=randomImageUrl로 안해도 되서 넣었음
  } else { //떨어지면 아이템없에버림 어디떨어진지 모르니까 걍 전체 백지화시킴..
    ctx.clearRect(0, 0, canvas.width, canvas.height); //그린거 다시 그리기위해 전체 백지화
    drawPaddle(); // 공받아치는 판
    drawMoveBall(); //공 그리기
    drawBoard(); //벽돌그리기
  }
  // 프레임 활용해서 다시 그림

}

// 보드의 남아있는 블럭을 체크 없으면 다음스테이지
function checkBoard() {

  //전체적으로 남은블럭이있는지 둘러본다
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if(Board[i].length > 0 && Board[i][j]) {
        if (Board[i][j].blockNum == 1 || Board[i][j].blockNum == 2 || Board[i][j].blockNum == 5) {
          remains++;
        }

      }
    }
  }
  //남은놈이 없으면 스테이지 증가
  if (remains === 0) {
    stage++;
    nextStage();
  }
  //다시체크하기위해 변수 0으로 초기화
  remains = 0;
}

//다음스테이지
function nextStage() {
  player.play(stageClear);
  isStarted = false;
  dy = 0;
  y = canvas.height - 130;  // 이거 없으면 공 세로 위치가 바닥에 꽂혀있는 상태로 움직임
  x = paddleXPosition + paddleWidth / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(); // 공받아치는 판
  drawBall(); //공 그리기
  drawBoard(); // 블럭그리기
  if (stage == 2) {
    dx = 0;
    drawStage2();
  } else if (stage == 3) {
    dx = 0;
    drawStage3();

  } else if (stage > 3) {
    // 게임 클리어하는 부분인데 일단 임시로 이렇게 해 놓았음
    alert('게임 클리어');
    saveScore();
    document.location.reload();
  }
}
//---------------------------------------------------------------------------



//임의로 스테이지 추가해서 확인중인것 이거바꾸면 블럭 전체 모양바뀜 ㅇㅇ 이넘으로 스테이지 그림
drawStage1();
// -----------------------------------------------------------------------
/*
정해준이 수정함
원래 drawBoard함수에 x좌표 ,y좌표를 계산해서 블록 없어지게 만들었습니다
*/
function drawBoard() {
  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {
      if(Board[i].length > 0 && Board[i][j]) {
        if (Board[i][j].blockNum >= 1) {
          // 1 이상으로 설정하면 다양한 블록들을 처리할수있겠지.
          const brickX = j * (block_width + 1) + 15; // x좌표값 계산
          const brickY = i * (block_height + 1) + 10; // y 좌표값 계산

          // 충돌 감지 및 블록 그리기
          // 공이 그려지는좌표가 블럭안으로 들어간경우
          if (
            x + ballSize >= brickX &&
            x <= brickX + block_width &&
            y + ballSize >= brickY &&
            y <= brickY + block_height
          ) {
            // 충돌 발생 시 블록을 없애고 값 0으로 변경 블록 사라짐
            Board[i][j].blockNum -= 1;
            player.play(attack_block);
            // 보드의 남아있는 블럭을 체크 없으면 다음스테이지
            checkBoard();

            if (Board[i][j].blockNum === 0 && isGetItem2==true) {
              // 송경석이 수정함, 파워아이템상태일때 점수오르는 폭을 늘렸습니다 게임끝났을때 모두가 똑같은점수면 안되니까.
              scoreTitle.textContent = parseInt(scoreTitle.textContent) + 50;
            } else if (Board[i][j].blockNum === 0) {
              // 정해준이 수정함, 블록 하나당 10점 오르게 점수 표시해놨습니다
              scoreTitle.textContent = parseInt(scoreTitle.textContent) + 10; // 수정하셔도 됩니다
            }
            // 45~69 정해준이 수정함. -> 송경석이 코드 다잡아먹어버림;;
            // 충돌 지점 계산
            const collisionX = x + ballSize / 2;
            const collisionY = y + ballSize / 2;

            // 블록의 오른쪽끝 아래쪽끝 좌표 계산
            const blockX = brickX + block_width; // 56 ~ 72수정했습니다 -경석
            const blockY = brickY + block_height;

            // x,y 좌표를 기준으로 블럭이 처음들어갔을때

            // 이거좀바꾸지마셈
            // 공의 중심좌표가 블럭의 상단 줄과 하단줄에 있을때
            if (!isGetItem2 || Board[i][j].blockNum >=9) {
              if (collisionX >= brickX - 1 && collisionX <= blockX - 1 || brickY < collisionY || brickY >= collisionY) {
                dy = -dy;
              }
            }
            // 공의 중심좌표가 블럭의 왼쪽줄과 오른줄에 있을때
            if (!isGetItem2 || Board[i][j].blockNum >=9) {
              if (collisionY >= brickY && collisionY <= blockY || collisionX == brickX || collisionX == blockX) {
                dx = -dx;
              }
            }
          }
          //-------------------------- 송경석--------------
          if (Board[i][j].blockNum === 0) {
            //블럭 안그림
          }
          if (Board[i][j].blockNum === 1) {
            // 블록을 그립니다.
            // 일반 블럭 그림
            ctx.drawImage(nomal_block, brickX, brickY);
          }
          if (Board[i][j].blockNum === 2) {
            //강화 블럭 그림
            ctx.drawImage(strong_block, brickX, brickY);
          }
          if (Board[i][j].blockNum === 4) {
            Board[i][j].blockNum = 0; //

            animateItem(brickX, brickY, Board[i][j].randomImageUrl);
          }
          if (Board[i][j].blockNum === 5) {
            ctx.drawImage(itemImage, brickX, brickY);
          }
          if (Board[i][j].blockNum === 9) {
            Board[i][j].blockNum += 1; // 블럭상태유지
            ctx.drawImage(nobroken_block, brickX, brickY);
          }
          if (Board[i][j].blockNum === 10) {
            ctx.drawImage(nobroken_block, brickX, brickY);
          }
          //-------------------------------------------------
        }
      }
    }
  }
}

