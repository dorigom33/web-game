
//이미지가 로딩되려면 load이벤트를 충족해야함
window.addEventListener('load', function () {

    // 실험용
    // Board[4][5] = 10;
    // Board[4][10] = 10;
    // Board[2][2] = 10;
    // Board[9][5] = 5;
    // Board[3][6] = 2;
    // Board[2][1] = 2;
    // Board[1][6] = 2;


    dy = 0;
    for (let i = 0; i < life; i++) {
        life_html += '<img src="/team5/img/ball.png" alt="공"></img>';
    }
    document.querySelector('#lives').innerHTML = life_html;


    drawPaddle(); // 공받아치는 판
    drawBall(); //공 그리기
    drawBoard(); // 블럭 그리기

    canvas.addEventListener('click', function (e) {
        // 클릭해서 시작하면 시작 메시지 지우려고 만든거임. 임시로 만든거라 이상하면 업새도됨
        if(y === canvas.height - 130){
            document.querySelector('#startMsg').innerHTML = '';
            isStarted = true;
            isBallfloor = false; //공이 바닥으로 떨어졌냐?
            dy = -3;
            dx = 0;
            console.log(dy);
            clearInterval(interval);
            interval = setInterval(function () {
                //지우고 그리고 반복하겠지.. 충돌함수도 고려..
                ctx.clearRect(0, 0, canvas.width, canvas.height); //그린거 다시 그리기위해 전체 백지화
                //drawPaddle하고 drawMoveBall 순서바꾸면안되네요
                drawPaddle(); // 공받아치는 판
                drawMoveBall(); //공 그리기
                drawBoard(); //벽돌그리기
            }, 1);
        }

    })
});