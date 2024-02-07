const paddleHeight = 20; //패들 세로길이
let paddleWidth = 150; //패들 가로길이
let paddleXPosition = (canvas.width - paddleWidth) / 2;     // 공 받이의 x축 위치(가로 위치)
let effect = false; // 공이 패들을 맞았을때 나오는 이펙트
// 공 받이 그리는 함수
function drawPaddle() {
    if(effect){
        ctx.drawImage(paddleImage2, paddleXPosition, canvas.height - 100, paddleWidth, paddleHeight);
    } else if(isEatStickItem) {
        ctx.drawImage(stickyPaddleImage, paddleXPosition, canvas.height - 100, paddleWidth, paddleHeight);   
    }
    else{
        ctx.drawImage(paddleImage, paddleXPosition, canvas.height - 100, paddleWidth, paddleHeight);
    }
}

// 공과 패들이 맞았을때 나오는 효과
function ballPaddleEffect(){
  setTimeout(function(){
    effect = false;
    drawPaddle();
  }, 100);
}

// 마우스 움직일 때마다 공 받이 위치 바뀜
canvas.addEventListener('mousemove', function (e) {
    if (e.movementX !== 0) {     // x축으로 움직임이 있으면
        if (!isStarted) {
            if(isEatStickItem) {
                ctx.clearRect(0, y, 1080, canvas.height - paddleHeight); //그린거 다시 그리기위해 전체 백지화
                y = canvas.height - 130; // 공의 y축 위치(세로 위치)
                drawBall(); //공그리기
                x = e.offsetX + betweenBallAndPaddle;

                // 아래처럼 하면 x값이 계속 바뀌어서 공이 이상하게 움직임, 그래서 jsj.js파일 44번째줄에 저거를 추가해서 위에 처럼 했는데 정상적으로 움직임
                // x = paddleXPosition + (x - dx - paddleXPosition + (paddleWidth / 2)); 
            } else {
                ctx.clearRect(0, y, 1080, canvas.height - paddleHeight); //그린거 다시 그리기위해 전체 백지화
                y = canvas.height - 130; // 공의 y축 위치(세로 위치)
                drawBall(); //공그리기
                x = e.offsetX; // 캔버스 안에서 기준으로 마우스의 x축 위치
            }
        }
        drawPaddle();
        // 오른쪽으로 움직이고, 공 받이의 위치가 오른쪽 벽 보다 작을때(벽에 부딪히면 더 안가게 하려고)
        if (e.movementX > 0 && paddleXPosition < (canvas.width - paddleWidth)) {     
            paddleXPosition = e.offsetX - paddleWidth / 2;    // 공 받이의 중간 부분이 마우스 커서로 오게 함
        // 왼쪽으로 움직이고, 공 받이의 위치가 왼쪽 벽보다 클때(벽에 부딪히면 더 안가게 하려고)
        } else if (e.movementX < 0 && paddleXPosition > 0) {     
            paddleXPosition = e.offsetX - paddleWidth / 2;

        }
    }
});