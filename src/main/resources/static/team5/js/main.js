
//------------------------------------main 실행전 중요한 요소들 추가-----------------------------------------------------
let isUpKeyPressed = false; //위방향키 로직용 변수 function keyevent 참조
document.addEventListener("keydown", handleKeyPress); //키다운 이벤트 추가
document.addEventListener("keyup", handleKeyUp); //키보드 땟을때 이벤트 키보드 뭐눌럿는지 보여주는거할때 했어요
// 위 방향키에서 손을 뗐을때 false로 바꿔서 정상 속도로 내려가게함
document.addEventListener("keyup", function (e) {
    isUpKeyPressed = false;
});
makeRandBlockIndex(); //블럭 7개 중복없이 랜덤생성

//-----------------------------------------------------------------------------------------
/*
    -간단한 구조설명-

    처음이코드를보면 그지같이 짜서 매우 어지러워보인다 그래도 집중해서 잘보고 따라와주길바랍니다.

    코드가 어려우면 audio.js 랑 block.js는 보지마세요 건들일이 이제 거의 없습니다.

    index.html과 bg.css 로 화면 구성

    js로는 테트리스의 움직임이나 음악재생을 담당하였습니다.
    block.js는 말그대로 블럭 모음집
    function.js는 main.js 에 전부 관여함 위에서부터 아래로 실제로 만든 순서대로 나열하였으며 switch case는 따로 모아두었습니다.
    마치 자바의 스테틱영역, 힙영역, 스택영역처럼 나눈것처럼 보면 뭔가 보일지도!?.

    1. 세로 29칸, 가로 12칸 테트리스 배열을 function.js에서 3개 생성
        [1] 조종할 블럭, [2] 쌓인 블럭, [3] 미리 보여주는 블럭

    2. canvas 를 통해서 배열이 ture인경우 해당 부분을 색칠하고 false 인경우 그리지 않습니다.

    3. setInterval을 통해서 주기마다 function을 실행시켜줘서 매순간순간을 점검하는 것이죠
        [1] 내가 조종하는 블럭은 매순간순간 지우고 그려주고 지우고 그려주고를 반복함 - tetrisBoardArray(), initCanvas(), getRandAndInitMoveY()
        [2] 블럭을 미리보여줌 - initNextBlockCanvas(), showNextBlock()
        [3] 쌓인 블럭을 체크해서 한줄이 채워졌으면 그줄은 비워버리면서 그위에있는 배열은 싹다 한줄씩 내림 - getBlockScore()
        [4] 스페이스바 버튼을 눌럿을때 블럭을 아래로 순식간에 내려버리는데 그 기준은 블럭중에서 가장 높이 쌓인 블럭을 기준으로함 - check_stacked()
        [5] 맨위에 블럭이 하나라도 ture인경우(쌓인경우) 바로 게임오버 시켜버립니다 - checkGameOverEvent()
        [6] 1. 블럭이 내려가는도중에 맨밑에 닿은경우
                blockLocationArray_x
                blockLocationArray_y 를통해서 해당하는 블럭의 최대 좌표를 구합니다 그리고 바닥에서 블럭의 최대좌표를 빼서 바닥에 안착시키는것이죠.
            2. 블럭이 쌓인 블럭과 겹친경우
                [블럭을 그릴때마다 체크해야함 블럭이 겹치는지 안겹치는지 - 블럭한개가 닿앗을때] - 이부분부터 보면됩니다
                move_x, move_y 를통해 우리는 조종할 블럭의 좌표를 정하고 drawBlock(x,y) 로 그려줍니다 다시말하면 move_x, move_y가 블럭의 이동에 관여하는것인거죠.
                if (stackedBoard[x][y] == tetrisBoard[x][y]) 스택보드는 쌓인것 테트리스 보드는 그린것인데 이것이 겹치는순간 바로 그순간블럭의 좌표를 뽑아낸다음 move_y를 -1 해서 위로 올려 스택보드에 그리게 하는것 인거죠.
                getRandAndInitMoveY 이거는 ctrl 눌러서 이동하면 뭐라뭐라되있는데 코드길어지는거 싫어서 걍 함수로 뺏습니다 ㅋㅋㅋ

            3. 참쉽죠? 궁금한거있으면 언제든질문.

    4. function.js에 for문에 있는 h, w는 height(세로), width(가로)
*/


//여기가 테트리스 실행부 main.js------------------------------------------------------------
function main() {
    player.play(bgm);
    //블럭 7개 중복되지않게 뽑아내기
    makeRandBlockIndex();
    const test = setInterval(function () {
        let randomBlock = chooseBlock(blockIndex[0]); //function.js에서 블럭랜덤으로 선택
        tetrisBoardArray(); //배열초기화
        initCanvas(); //배경덮어씀
        initNextBlockCanvas(); // 블럭미리보여주는곳 검은색으로 칠함
        showNextBlock(); // 다음블럭보여줌
        initNextBlockCanvas2(); // 블럭미리보여주는곳 검은색으로 칠함
        showNextBlock2(); // 다다음블럭보여줌
        initSaveBlockCanvas(); //저장한 블럭 보여주는곳 초기화
        showSaveBlock(); //저장한 블럭 보여주는곳
        getBlockScore(); //블럭이 한줄이 채워져있는지 확인하기 채워졌으면 지움
        check_stacked(); ////제일 높이 쌓여있는 블럭의 높이를 저장하는 함수
        checkGameOverEvent(); // 맨위 블럭이 쌓이면 게임오버
        rotate_num = Math.abs(rotate) % 4; //블록회전시키는것 0~3값만나옵니다
        controll_x = 0; // 오른쪽으로 빠져나가지 않게하는 변수
        controll_y = 0; // 높이가 높은 블럭을 내렸을때 맨밑바닥인경우 조절해줌
        blockLocationArray_x = []; //블럭의 x좌표 값들 저장하는배열
        blockLocationArray_y = []; //블럭의 y좌표 값들 저장하는배열
        controll_x_min = 2;

        // 블럭을 그릴때마다 체크해야함 블럭이 겹치는지 안겹치는지 - 블럭한개가 닿앗을때
        for (let i = 0; i < randomBlock[0].length; i++) {
            let w = randomBlock[rotate_num][i][1] + move_x; // x 좌표
            let h = randomBlock[rotate_num][i][0] + move_y; // y 좌표
            block_w[i] = w; //블럭의 현재 좌표 w=x 라고 이해하면편함!
            block_h[i] = h; //블럭의 현재 좌표 h=y 라고 이해하면편함!
            drawBlock(h, w); //블럭에 있는 좌표들 칠함
            blockLocationArray_x.push(w - move_x); //블럭의오른쪽 최대길이
            blockLocationArray_y.push(h - move_y); //블럭의아래쪽 최대길이

            if (stackedBoard[h][w] == tetrisBoard[h][w]) {  //이게 제일중요 그리는거하고 쌓인거하고 겹쳤을때 로직
                for (let i = 0; i < randomBlock[0].length; i++) {  //그자리에있는 블럭의 좌표 뽑아냄
                    let w = randomBlock[rotate_num][i][1] + move_x; // x 좌표
                    let h = randomBlock[rotate_num][i][0] + move_y; // y 좌표
                    //바로위에다가 그려야하니까 y-1 // y가 증가할수록 내려감 // 감소할수록 올라감
                    if (h - 1 >= 0) {
                        if (!(stackedBoard[h - 1][w])) {
                            stackedBoard[h - 1][w] = true; // 회색블럭으로 그리는것
                        }

                    }


                }
                //이건 블럭높이 초기화해주고 랜덤블럭 배열에 밀어넣어주는역할함
                getRandAndInitMoveY();
            }
        }
        //x와 y의 최대값 뽑는 것 Min, Max 구하는거
        for (let num = 0; num < blockLocationArray_x.length; num++) {
            if (controll_x < blockLocationArray_x[num]) { //블록의 오른쪽 최대좌표
                controll_x = blockLocationArray_x[num];
            }
            if (controll_y < blockLocationArray_y[num]) { // 블록의 아래 최대 좌표
                controll_y = blockLocationArray_y[num];
            }
            if (controll_x_min > blockLocationArray_x[num]) { //블록의 왼쪽 최소 좌표 // 그릴때 왼쪽좌표가 1인경우도있음 ex) ㅡ, ㅣ
                controll_x_min = blockLocationArray_x[num];
            }

        }


        // 블럭이 회전햇을때 오른쪽으로 빠져나왔으면 블럭을 왼쪽으로 밀어냄
        if (move_x > widthBlockCount - (controll_x + 1)) {
            move_x -= controll_x - 1;
        }
        // 블럭이 회전햇을때 왼쪽으로 빠져나왔으면 블럭을 오른쪽으로 밀어냄
        if (move_x < (controll_x_min) && controll_x_min == 0) {
            move_x += 1;
        }
        //-----------------------------------------------------
        drawBlocks(); //이게 쌓인블록과 내가 조종할 블록을 그려주는 함수 funtion.js에 빼놨음 //함수는 싹다 function에 넣어놨어요
        //-----------------------------------------------------

        // 맨밑으로 갔을때
        if (move_y == heightBlockCount - (controll_y + 1)) {//controll_y는 배열의 좌표라 +1해줫음
            //블럭의 높낮이에 따라서 블럭을올려주거나 낮춰줌 controll_y 값이 달라짐
            for (let i = 0; i < randomBlock[0].length; i++) {
                let x = randomBlock[rotate_num][i][1] + move_x; // x 좌표
                let y = randomBlock[rotate_num][i][0] + move_y; // y 좌표
                stackedBoard[y][x] = true;
            }
            //이건 블럭높이 초기화해주고 랜덤블럭 배열에 밀어넣어주는역할함
            getRandAndInitMoveY();
        }
        speedControll();
        speedCount++; //
        tetrisBoard.length = 0; //배열값삭제
    }, 1); //숫자 건들지마시오.

    //맨위의 블럭이 채워졌을경우 게임오버
    async function checkGameOverEvent() {
        for (let w = 0; w < widthBlockCount; w++) {
            if (stackedBoard[0][w]) {
                initCanvas(); //배경덮어씀
                player._stop(bgm);//전부 초기화 시킴
                player.play(gameOver);//전부 초기화 시킴
                clearInterval(test);//전부 초기화 시킴
                stackedBoard.length = 0;//전부 초기화 시킴
                stackedBoardArray();//전부 초기화 시킴
                stacked_height = 0;//전부 초기화 시킴
                tetrisBoard.length = 0; //배열값삭제
                tetrisBoardArray(); //배열초기화
                initNextBlockCanvas(); // 블럭미리보여주는곳 검은색으로 칠함
                initNextBlockCanvas2();// 블럭미리보여주는곳 검은색으로 칠함
                initSaveBlockCanvas(); // 블럭미리보여주는곳 검은색으로 칠함
                saveBlockIndex = 0; //저장된블럭삭제
                blockIndex.length = 0; //블럭인덱스 내용물다삭제

                //--------------------------------여기 밑에다가 async 함수 만들어서 포인트 인포 테이블에 인서트 되게함------------------------
                // console.log(document.querySelector('#uiNum').value);
                // console.log(document.querySelector('#score').textContent);
                // console.log(score);
                if(score > 0) {
                    const res = await fetch('/team5/point-infos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            giNum: 4,
                            uiNum: document.querySelector('#uiNum').value,
                            piPoint: score
                        })
                    });
                    const scoreResult = await res.json();
                    console.log(scoreResult);
                }
            }
        }
    }
}
