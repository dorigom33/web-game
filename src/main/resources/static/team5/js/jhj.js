let dx = 0; // x축 방향으로 움직이는 속도 초기화한 값
let dy = 0; // y축 방향으로 움직이는 속도 초기화한 값.
const ballSize = 10; // 공 사이즈 크기 10으로 지정.
let betweenBallAndPaddle = 0;

function drawBall() {
  // 공 그리는 로직
  if (isGetItem2) {
    ctx.drawImage(PowerballImage, x - 10, y, 30, 30);
  } else {
    ctx.drawImage(ballImage, x - 10, y, 30, 30);
  }

}

async function saveScore() {
  if(scoreTitle.textContent > 0) {
    const res = await fetch('/team5/point-infos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        giNum: 5,
        uiNum: document.querySelector('#uiNum').value,
        piPoint: parseInt(scoreTitle.textContent)
      })
    });
    const scoreResult = await res.json();
    console.log(scoreResult);
  } else {
    alert('0점은 기록에 저장되지 않음!');
  }
}

function drawMoveBall() {
  // x,y좌표를 통해 공그림

  drawBall();
  // 좌,우 둘 중에 하나라도 벽에 부딪히면 공이 dx에서 -dx음수 값으로 변하면서 공이 반대방향으로 튐.
  if (x + dx > canvas.width - ballSize || x + dx < ballSize) {
    dx = -dx;
  }
  // 상,하단 둘 중에 하나라도 벽에 부딪히면 공이 dy에서 -dy로 뀌면서 공이 반대로 튀게됨
  if (y + dy < ballSize) {
    dy = -dy;
  }
  // else if 인거 if로 수정 그리고 100 -> 90으로 수정 패들을 얇게해서 얇아진만큼 타점을 조정했음 -송경석-
  if ((y + dy > canvas.height - 100 - ballSize) && (y + dy < canvas.height - 90 - ballSize)) {

    // 26번줄 ~ 36번줄 - 류승호가 추가하였습니다. 패달에 맞으면 튀김
    if (x >= paddleXPosition && x <= paddleXPosition + paddleWidth) {  // 공의 위치가 패달의 y축(높이)에 닿고 패달의 x축(가로) 범위 안에 있으면 튀김 (그냥 쉽게말해서 패달에 맞으면 튀긴다는거임)
      effect = true; //패들에 이펙트주려고..
      ballPaddleEffect(); // 암튼그럼.. Ctrl 눌러서 따라가면 어딨는지 볼수있음
      player.play(paddle_sound); //효과음재생
      // console.log('공 위치 = ' + x + ', ' + '패들위치 = ' + paddleXPosition);
      if(isEatStickItem) {
        y = canvas.height - 130;
        dy = 0;
        clearInterval(interval);
        interval = setInterval(function () {
          //지우고 그리고 반복하겠지.. 충돌함수도 고려..
          ctx.clearRect(0, 0, canvas.width, canvas.height); //그린거 다시 그리기위해 전체 백지화
          //drawPaddle하고 drawMoveBall 순서바꾸면안되네요
          drawPaddle(); // 공받아치는 판
          drawBall();
          drawBoard(); //벽돌그리기
      }, 1);
        ctx.clearRect(0, y, 1080, canvas.height - paddleHeight); //그린거 다시 그리기위해 전체 백지화
        betweenBallAndPaddle = x - dx - (paddleXPosition + paddleWidth / 2);
        drawBall();
        drawPaddle();
        isStarted = false;
      }
      //dx고정 값에서 랜덤으로 수정됐습니다 /성규
      if (x < paddleXPosition + (paddleWidth / 8)) { // paddleWidth - paddleWidth/8 = 18.??
        dx = Math.random() - 4;
        // console.log('맞은 부분 = 1/8, x축 속도 = ' + dx + '로 변경');
      }
      if (x === (paddleXPosition + paddleWidth) / 2) {
        dx = 0;
        // console.log('맞은 부분 = 정중앙, x축 속도 = ' + dx + '로 변경');
      }
      else if (x < paddleXPosition + (paddleWidth / 8) * 2) {
        dx = Math.random() - 3;
        // console.log('맞은 부분 = 2/8, x축 속도 = ' + dx + '로 변경');
      } else if (x < paddleXPosition + (paddleWidth / 8) * 3) {
        dx = Math.random() - 1.2;
        // console.log('맞은 부분 = 3/8, x축 속도 = ' + dx + '로 변경');
      } else if (x < paddleXPosition + (paddleWidth / 8) * 4) {
        dx = Math.random() - 0.5;
        // console.log('맞은 부분 = 4/8, x축 속도 = ' + dx + '로 변경');
      } else if (x < paddleXPosition + (paddleWidth / 8) * 5) {
        dx = Math.random();
        // console.log('맞은 부분 = 5/8, x축 속도 = ' + dx + '로 변경');
      } else if (x < paddleXPosition + (paddleWidth / 8) * 6) {
        dx = Math.random() + 0.5;
        // console.log('맞은 부분 = 6/8, x축 속도 = ' + dx + '로 변경');
      } else if (x < paddleXPosition + (paddleWidth / 8) * 7) {
        dx = Math.random() + 1.2;
        // console.log('맞은 부분 = 7/8, x축 속도 = ' + dx + '로 변경');
      } else if (x <= paddleXPosition + (paddleWidth / 8) * 8) {
        dx = Math.random() + 3;
        // console.log('맞은 부분 = 8/8, x축 속도 = ' + dx + '로 변경');
      }
      dy = -dy;
    }
  }
  if (y + dy > canvas.height) {
    // 바닥에 닿으면 게임 종료 후 새로고침
    isBallfloor = true; //공이 떨어졌다.
    --life; // 목숨감소
    life_html = ''; //새로써야겠지?
    for (let i = 0; i < life; i++) {
      life_html += '<img src="/team5/img/ball.png" alt="공"></img>';
    }
    document.querySelector('#lives').innerHTML = life_html; //목숨개수를 새로쓴다.

    if (life === 0) { //목숨이 없어지면?
      saveScore();
      alert("게임 종료") //ㅋㅋ
      clearInterval(interval);  // 이거 없으면 공 위치가 초기화가 안되서 31번줄 if문에 계속 걸려서 경고창 뜨는것 같아서 넣었음.
      document.location.reload();
    } else {
      clearInterval(interval);
      document.querySelector('#lives').innerHTML = life_html;
      isStarted = false;  // rsh.js에 마우스무브 이벤트에 있는 if(!isStarted) 때문에 적어놓음
      isEatStickItem = false;
      dy = 0;
      y = canvas.height - 130;  // 이거 없으면 공 세로 위치가 바닥에 꽂혀있는 상태로 움직임
      x = paddleXPosition + paddleWidth / 2; //공위치 초기화
      drawPaddle(); // 공받아치는 판
      drawBall(); //공 그리기


    }
    dy = -dy;
  }
  x += dx;
  y += dy;
}

//신기하네요..